from configparser import ConfigParser
import pandas as pd
import os

from azure.identity.aio import ClientSecretCredential
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from msgraph import GraphServiceClient
from pydantic import ValidationError
import requests

from graph import downloading_excel_files_from_sharepoint, old_get_files_in_sharepoint_folder
from utils import harmonize_dict_keys
from verifypydantic import User

ms_config = ConfigParser()
ms_config.read(["msgraph.cfg"])

client_id = ms_config["azure"]["clientId"]
tenant_id = ms_config["azure"]["tenantId"]
client_secret = ms_config["azure"]["clientSecret"]
graph_scope = ms_config["azure"]["graph_scope"]
name_downloaded_files = "downloaded_files"
name_uploaded_files = "generated_excel"
path_uploaded_files = f"./{name_uploaded_files}/"

config = os.environ

credential = ClientSecretCredential(tenant_id, client_id, client_secret)
client = GraphServiceClient(credentials=credential, scopes=[graph_scope])

app = FastAPI()

SHEETS_TO_IGNORE = ["raw_list", "analysis"]

domain_name = config.get("DOMAIN_NAME") if config else None
origins = [domain_name] if domain_name else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-files-in-sharepoint-folder")
async def fn_get_files_in_sharepoint_folder():
    return await old_get_files_in_sharepoint_folder(credential, graph_scope, ms_config)

@app.get("/sheet-names")
def sheet_names(path):
    sheet_names = pd.ExcelFile(path)
    return sheet_names.sheet_names


@app.post("/sheet-information")
async def sheet_information(id: str):
    await downloading_excel_files_from_sharepoint(id, credential, graph_scope, ms_config)
    
    path = f"./downloaded_files/{id}.xlsx"
    sheets = [sheet for sheet in sheet_names(path) if sheet not in SHEETS_TO_IGNORE]
    
    if len(sheets) == 0:
        return {"Excel":{"File": [f"This file is not valid"]}}
    
    # create one dict with all sheets data
    all_sheets = {}
    for sheet in sheets:
        df = pd.read_excel(path, sheet_name=sheet)
        df = df.fillna("")
        all_sheets[sheet] = df.to_dict('records')
        
    errors = {}

    for sheet in all_sheets:
        error = {"sheet": sheet}
        
        for row in all_sheets[sheet]:
            row = harmonize_dict_keys(row)

            try:
                user = User(**row)
            except ValidationError as e:
                for error in e.errors():
                    if sheet not in errors:
                        errors[sheet] = {}
                        
                    if "alias" not in row:
                        return {"Excel":{"File": [f"This file is not valid"]}}
                    
                    if row["alias"] not in errors[sheet]:
                        errors[sheet][row["alias"]] = []
                        
                    loc = " -> ".join(str(l) for l in error['loc'])
                    errors[sheet][row["alias"]].append(f"{loc} : {error['msg']}")
    return errors 

@app.post("/synchronization")
async def synchronization(id: str):
    if not id:
        return
    
    path = f"./downloaded_files/{id}.xlsx"
    sheets = [sheet for sheet in sheet_names(path) if sheet not in SHEETS_TO_IGNORE]
    
    if len(sheets) == 0:
        return
    
    # create one dict with all sheets data
    all_aliases = []

    for sheet in sheets:
        df = pd.read_excel(path, sheet_name=sheet)
        df = df.fillna("")
        records = df.to_dict('records')
        all_aliases.extend(records)
        
    all_aliases = [harmonize_dict_keys(alias) for alias in all_aliases]

    progress = None

    try:
        url = "http://ulysseus-toolbox-nginx/toolbox/backend/progress"
        process = requests.request("POST", url)
        
        if not process:
            raise Exception()
    except:
        print("Unable to create a new process")
        return
    
    progress = progress.json()
    
    headers = {'X-API-KEY': config["X-API-KEY"]}
    
    for index, alias in enumerate(all_aliases):
        # update progress
        if index % 2 == 0:
            percentage = int((index + 1) / len(all_aliases) * 100)
            requests.patch(f"{config.get('NEXT_PUBLIC_BACKEND_AUTH_URL')}/progress/{progress['id']}", data={'progress': percentage})
            
        payload = {
            "alias": alias["alias"].split("@")[0],
            "emails": alias["members"].replace(";",","),
            "displayName":alias["display_name"],
            "owners":alias["owners"].replace(";",",")
        }

        try:
            r = requests.post(f"{config.get('POWERSHELL_URL')}/groups/synchronise-with-excel-file", data=payload, verify=False, headers=headers)
            if not r.text:
                raise Exception("no data returned from nestjs during synchronise-with-excel-file process")
        except:
            print("synchronise-with-excel-file error")

    try:
        requests.patch(f"{config.get('NEXT_PUBLIC_BACKEND_AUTH_URL')}/progress/{progress['id']}", data={"status": 'COMPLETED'})
    except:
        print("Error during setting process as completed")