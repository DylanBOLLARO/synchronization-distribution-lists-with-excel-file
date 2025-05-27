import asyncio
from collections import defaultdict
from configparser import ConfigParser
import json
import os
from typing import List, Optional
import pandas as pd

from azure.identity.aio import ClientSecretCredential
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from msgraph import GraphServiceClient

from graph import downloading_excel_files_from_sharepoint, old_get_files_in_sharepoint_folder

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
    
    sheets = sheet_names(path)
    
    all_sheets = {}
    errors = []
    
    for sheet in sheets:
        df = pd.read_excel(path, sheet_name=sheet)
        df = df.fillna("")
        dd = defaultdict(list)
        all_sheets[sheet] = df.to_dict('records', into=dd)
        
    for sheet in all_sheets:
        if sheet in ["raw_list", "analysis"]:
            continue
        
        error = {"sheet": sheet}
        
        for dict in all_sheets[sheet]:
            try:
                if not len(dict["Members "].split(";")) > 0:
                    error["message"] = f"Error in Alias {dict["Alias"]} on the col Members, check separator , or ;"
                    errors.append(error)
                    
                if "," in dict["Members "]:
                    error["message"] = f"Error in Alias {dict["Alias"]} on the col Members, check separator ,"
                    errors.append(error)
                
                if not len(dict["Owner "].split(";")) > 0:
                    error["message"] = f"Error in Alias {dict["Alias"]} on the col Owner, check separator , or ;"
                    errors.append(error)
                    
                if "," in dict["Owner "]:
                    error["message"] = f"Error in Alias {dict["Alias"]} on the col Owner, check separator ,"
                    errors.append(error)
            except:
                errors.append(error)
    return errors