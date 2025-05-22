import asyncio
import datetime
import json

import aiohttp
import requests


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
            f"{config['azure']['ENDPOINT']}/sites",
            headers=headers,
        ) as response:
            drive_info = await response.json()
            return drive_info["id"]




async def get_folder_id(credential, graph_scope, config, subfolder=""):
    drive_id = await get_drive_id(credential, graph_scope, config)
    headers = await create_headers(credential, graph_scope)
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"{config['azure']['ENDPOINT']}/drives/{drive_id}/root/search(q='alias')",
            headers=headers,
        ) as response:
            folder = await response.json()
            print(folder)
            # return folder["id"]


async def get_files_in_sharepoint_folder(credential, graph_scope, config, subfolder=""):
    drive_id = await get_drive_id(credential, graph_scope, config)
    folder_id = await get_folder_id(credential, graph_scope, config)
    return
    headers = await create_headers(credential, graph_scope)
    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"{config['azure']['ENDPOINT']}/drives/{drive_id}/items/{folder_id}/children{ f'/{subfolder}' if subfolder else ''}",
            headers=headers,
        ) as response:
            childrens = await response.json()
            return childrens["value"]


# async def upload_file_in_sharepoint_folder(
#     credential, graph_scope, config, name_file, buffer
# ):
#     drive_id = await get_drive_id(credential, graph_scope, config)
#     folder_id = await get_folder_id(credential, graph_scope, config)
#     headers = await create_headers(credential, graph_scope)

#     async with aiohttp.ClientSession() as session:
#         async with session.put(
#             f"{config['azure']['ENDPOINT']}/drives/{drive_id}/items/{folder_id}:/{name_file}:/content",
#             headers=headers,
#             data=buffer,
#         ) as response:
#             return response


# async def move_all_files_to_a_folder(credential, graph_scope, config):
#     new_folder_id = await creating_new_folder(credential, graph_scope, config)
#     drive_id = await get_drive_id(credential, graph_scope, config)
#     headers = await create_headers(credential, graph_scope)

#     files_in_sharepoint = await get_files_in_sharepoint_folder(
#         credential, graph_scope, config
#     )

#     files_in_sharepoint_list = [
#         f for f in files_in_sharepoint if "file" in f and f["name"].endswith("xlsx")
#     ]

#     for children in files_in_sharepoint_list:
#         payload = {
#             "parentReference": {"id": new_folder_id},
#             "name": children["name"],
#         }
#         async with aiohttp.ClientSession() as session:
#             async with session.patch(
#                 f"{config['azure']['ENDPOINT']}/drives/{drive_id}/items/{children['id']}",
#                 headers=headers,
#                 data=json.dumps(payload),
#             ) as response:
#                 if response.status in [200]:
#                     print(
#                         f"The file {children['name']} have been moved to the new folder"
#                     )


# async def creating_new_folder(credential, graph_scope, config):
#     drive_id = await get_drive_id(credential, graph_scope, config)
#     folder_id = await get_folder_id(credential, graph_scope, config, "OLD")
#     headers = await create_headers(credential, graph_scope)

#     timestamp = datetime.datetime.now().strftime("%d_%B_%Y_%H%M%S")
#     name_new_folder = f"curriculum_{timestamp}".lower()

#     payload = {
#         "name": name_new_folder,
#         "folder": {},
#         "@microsoft.graph.conflictBehavior": "rename",
#     }

#     async with aiohttp.ClientSession() as session:
#         async with session.post(
#             f"{config['azure']['ENDPOINT']}/drives/{drive_id}/items/{folder_id}/children",
#             headers=headers,
#             data=json.dumps(payload),
#         ) as response:
#             if response.status in [201]:
#                 print(f"Folder {name_new_folder} created.")
#                 folder_id = await get_folder_id(
#                     credential, graph_scope, config, f"OLD/{name_new_folder}"
#                 )
#                 return folder_id
