import logging
import os
import uuid

import magic
import starlette.datastructures
import uvicorn
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from starlette.responses import Response, FileResponse


from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.timing import add_timing_middleware
from starlette.middleware import Middleware
from starlette.responses import Response
from typing import Optional
from pydantic import BaseModel


load_dotenv()
TMP_FOLDER = "/tmp"
origins = []

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
    "*"
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
]
app = FastAPI(middleware=middleware)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
add_timing_middleware(app, record=logger.info, prefix="app", exclude="untimed")

async def store_file(file):
    # Save file
    file_id = uuid.uuid4()
    file_path = f"{TMP_FOLDER}/geotagseo-{file_id}"

    with open(file_path, "wb") as binary_file:
        binary_file.write(await file.read())

    return file_path, file_id

# Input parameter:
# - the file
# Output:
# - a unique id to identify the file
@app.post('/file')
async def postFile(response: Response, file: UploadFile = File(...)):
    (file_path, file_id) = await store_file(file)

    return {
        'fileId': file_id,
    }

@app.get("/file")
async def getfile(fileId: str):
    file_path = f"{TMP_FOLDER}/geotagseo-{fileId}"
    return FileResponse(file_path)

class Rectangle(BaseModel):
    min_x: float
    min_y: float
    max_x: float
    max_y: float

class Body(BaseModel):
    rectangle: Rectangle
    replace_by: str

@app.post("/replace")
async def postFile(parameters: Body):
    fileId = "coming"
    return JSONResponse(status_code=200, content={"fileId": fileId})


@app.get("/ping")
async def ping():
    return {"msg": "Pong"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
