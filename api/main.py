import os
import glob
from typing import List, Optional
from urllib.parse import unquote
from fastapi import FastAPI, Cookie, Query, Response, Header
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import yaml
import json
import pandas as pd
from pydantic import BaseModel

app = FastAPI()

# CORS
origins = [
    "http://localhost",
    "https://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load concifg
with open('/conf/config.yml') as fp:
    cfg = yaml.load(fp, Loader=yaml.FullLoader)

# scan for data packages
# - [ ] future: store matches in db and update periodically or on-the-fly?
# - [ ] https://fastapi-utils.davidmontague.xyz/user-guide/repeated-tasks/?
# root_dir needs a trailing slash (i.e. /root/dir/)

# create dicts to store loaded datapackages and filepaths associated with each uuid
pkgs = {}
files = {}

# testing; just return full datapackage json files for now.. later, can limit
# to subset
for path in cfg['data_dirs']:
    search_path = os.path.join(path, '**/datapackage.json')

    for filename in glob.iglob(search_path, recursive=True):

        with open(filename) as fp:
            pkg = json.load(fp)

        #pkg_id = pkg['eco']['metadata']['data']['dataset']['id']

        if "uuid" in pkg["eco"]:
            uuid = pkg['eco']['uuid']
            pkgs[uuid] = pkg
            files[uuid] = filename
        else:
            print(f"Package missing UUID: {filename}")

@app.get("/datasets")
async def get_datasets():
    """Returns information about available datasets?"""
    return pkgs

@app.get("/stats")
async def get_stats():
    """Number of datasets, etc?"""
    pass

@app.get("/dataset/{uuid}")
async def get_dataset(uuid: str):
    """Retrieve information for a single dataset"""
    if uuid not in pkgs:
        return {"error": "invalid package id"}
    
    return pkgs[uuid]

@app.get("/dataset/{uuid}/views/{view_name}")
async def get_view(uuid: str, view_name: str):
    """Retrieve dataset view"""
    if uuid not in pkgs:
        return {"error": "invalid package id"}

    pkg = pkgs[uuid]

    # get datadag node
    node = pkg['eco']['nodes'][uuid]

    matched_view = None

    for view in node['views']:
        if view['name'] == view_name:
            matched_view = view

    if matched_view is None:
        return {"error": "unable to find specified view"}

    # load view data (stored in separate file for now)
    pkg_dir = os.path.dirname(files[uuid])
    infile = os.path.join(pkg_dir, matched_view['data'] + ".csv")

    dat = pd.read_csv(infile)

    return dat.to_dict(orient='records')
