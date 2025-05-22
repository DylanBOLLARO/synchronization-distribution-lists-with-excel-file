import asyncio
from configparser import ConfigParser

from azure.identity.aio import ClientSecretCredential
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from msgraph import GraphServiceClient

from graph import get_files_in_sharepoint_folder

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


@app.get("/")
def read_root():
    files_in_sharepoint = asyncio.run(
        get_files_in_sharepoint_folder(credential, graph_scope, ms_config)
    )
    # print(files_in_sharepoint)

    # [
    #     print(f)
    #     for f in files_in_sharepoint
    #     if "file" in f and f["name"].endswith(".xlsx")
    # ]

    return {"Hello": "World"}


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}
