from configparser import ConfigParser
import time
from typing import Optional
import pandas as pd

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

credential = ClientSecretCredential(tenant_id, client_id, client_secret)
client = GraphServiceClient(credentials=credential, scopes=[graph_scope])

app = FastAPI()

origins = [
    "http://localhost:3000",
]

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
async def sheet_information(id: Optional[str] = None):
    await downloading_excel_files_from_sharepoint(id, credential, graph_scope, ms_config)
    
    path = f"./downloaded_files/{id}.xlsx"
    sheets = [s for s in sheet_names(path) if s not in ["raw_list", "analysis"]]
    
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
                        
                    if row["alias"] not in errors[sheet]:
                        errors[sheet][row["alias"]] = []
                        
                    loc = " -> ".join(str(l) for l in error['loc'])
                    errors[sheet][row["alias"]].append(f"{loc} : {error['msg']}")
    return errors 

@app.post("/synchronization")
async def synchronization():
    progress = requests.post("http://localhost:3001/progress")
    
    if not progress:
        return
    
    progress = progress.json()
    
    for i in range(10):
        payload = {'progress': ((i+1)*10)}
        requests.patch(f"http://localhost:3001/progress/{progress["id"]}", data=payload)
        time.sleep(2)
        
    payload = {"status": 'COMPLETED'}
    requests.patch(f"http://localhost:3001/progress/{progress["id"]}", data=payload)
        