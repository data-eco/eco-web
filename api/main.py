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

# create a dict to store loaded datapackages associated with each dataset;
datasets = {}

# create a dict to store directories associated with each datapackage.yaml, index by
# uuid
pkg_dirs = {}

for path in cfg['data_dirs']:
    search_path = os.path.join(path, '**/datapackage.json')

    for filename in glob.iglob(search_path, recursive=True):

        with open(filename) as fp:
            pkg = json.load(fp)

        mdata = pkg["eco"]["metadata"]
        dataset_id = mdata["data"]["dataset"]["id"]

        # if this is the first time encountering dataset, add entry in datasets dict
        if dataset_id not in datasets:
            datasets[dataset_id] = {
                "metadata": mdata,
                "packages": {},
                "largest": {
                    "uuid": "",
                    "size": 0
                }
            }

        # check for data packages with missing UUIDs
        if "uuid" not in pkg["eco"]:
            print(f"Package missing UUID: {filename}")
            continue

        # add datapackage to dataset
        uuid = pkg['eco']['uuid']
        datasets[dataset_id]["packages"][uuid] = pkg
        pkg_dirs[uuid] = os.path.dirname(filename)

        # check to see if this is the further stage of processing (largest number of
        # nodes in dag) encountered yet
        num_nodes = len(pkg['eco']['nodes'])

        if num_nodes > datasets[dataset_id]["largest"]["size"]:
            datasets[dataset_id]["largest"] = {
                "size": num_nodes,
                "uuid": uuid
            }

@app.get("/datasets")
async def get_datasets():
    """Returns information about available datasets?"""
    return datasets

@app.get("/stats")
async def get_stats():
    """Number of datasets, etc?"""
    pass

@app.get("/dataset/{uuid}")
async def get_dataset(uuid: str):
    """Retrieve information for a single dataset"""
    for dataset in datasets:
        if uuid in datasets[dataset]['packages']:
            return datasets[dataset]['packages'][uuid]

    return {"error": "invalid package id"}


@app.get("/dataset/{uuid}/views/{view_name}")
async def get_view(uuid: str, view_name: str):
    """Retrieve dataset view"""
    pkg = None

    # get datapackage
    for dataset in datasets:
        if uuid in datasets[dataset]['packages']:
            pkg = datasets[dataset]['packages'][uuid]

    if pkg is None:
        return {"error": "invalid package id"}

    # get datadag node
    node = pkg['eco']['nodes'][uuid]

    matched_view = None

    for view in node['views']:
        if view['name'] == view_name:
            matched_view = view

    if matched_view is None:
        return {"error": "unable to find specified view"}

    # load view data (stored in separate file for now)
    pkg_dir = pkg_dirs[uuid]
    infile = os.path.join(pkg_dir, matched_view['data'] + ".csv")

    dat = pd.read_csv(infile)

    return dat.to_dict(orient='records')
