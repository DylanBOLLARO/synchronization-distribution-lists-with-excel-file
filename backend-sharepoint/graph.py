import os
import shutil
import aiohttp
import requests


name_downloaded_files = "downloaded_files"


async def get_app_token(credential, graph_scope):
    access_token = await credential.get_token(graph_scope)
    return access_token.token


async def create_headers(credential, graph_scope):
    bearer_token = await get_app_token(credential, graph_scope)
    return {
        "Authorization": f"Bearer {bearer_token}",
        "Content-Type": "application/json",
    }


async def get_drive_id(credential, graph_scope, config):
    headers = await create_headers(credential, graph_scope)
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"{config['azure']['ENDPOINT']}/sites/{config['azure']['sharepointId']}/drive",
            headers=headers,
        ) as response:
            drive_info = await response.json()
            return drive_info["id"]


async def get_files_in_sharepoint_folder(id, credential, graph_scope, config):
    drive_id = await get_drive_id(credential, graph_scope, config)
    headers = await create_headers(credential, graph_scope)
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"{config['azure']['ENDPOINT']}/drives/{drive_id}/items/{id}",
            headers=headers,
        ) as response:
            childrens = await response.json()
            return childrens
    return None
        
async def downloading_excel_files_from_sharepoint(id, credential, graph_scope, ms_config):
    shutil.rmtree(name_downloaded_files, ignore_errors=True, onerror=None)
    os.makedirs(os.path.join(name_downloaded_files), exist_ok=True)

    files_in_sharepoint = await get_files_in_sharepoint_folder(id, credential, graph_scope, ms_config)

    response = requests.get(files_in_sharepoint["@microsoft.graph.downloadUrl"])
    save_to_path = os.path.join(name_downloaded_files, files_in_sharepoint["id"]+".xlsx")
    
    with open(save_to_path, "wb") as f:
        f.write(response.content)
        
async def get_folder_by_search_with_name(credential, graph_scope, config,full=False):
    drive_id = await get_drive_id(credential, graph_scope, config)
    headers = await create_headers(credential, graph_scope)
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"{config['azure']['ENDPOINT']}/drives/{drive_id}/root/search(q='alias')",
            headers=headers,
        ) as response:
            folder = await response.json()
            files = []    
            if full:
                return folder
            
            for item in folder["value"]:
                file = {}
                if "name" in item and item["name"].endswith(".xlsx") and item not in files:
                    file["name"] = item["name"]
                    file["id"] = item["id"]
                    file["lastModifiedDateTime"] = item["lastModifiedDateTime"]
                    files.append(file)
            return files

async def old_get_files_in_sharepoint_folder(credential, graph_scope, config, full=False):
    return await get_folder_by_search_with_name(credential, graph_scope, config, full)
