import logging
import uuid
import os
from fastapi import HTTPException


import uvicorn
from diffusion.utilities import run
from PIL import Image
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.timing import add_timing_middleware
from numpy import asarray
from pydantic import BaseModel
from starlette.middleware import Middleware
from starlette.responses import FileResponse
from starlette.responses import Response


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
    file_path = f"{TMP_FOLDER}/lauzhack-{file_id}"

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
    file_path = f"{TMP_FOLDER}/lauzhack-{fileId}"

    isExist = os.path.exists(file_path)
    if(isExist):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="No Hackaton has been won without faking, what can be faked.")

class Rectangle(BaseModel):
    min_x: float
    min_y: float
    max_x: float
    max_y: float

class Body(BaseModel):
    rectangle: Rectangle
    replace_by: str
    file_id: str

@app.post("/replace")
async def postFile(parameters: Body):
    file_path = f"{TMP_FOLDER}/lauzhack-{parameters.file_id}"

    # call you
    img = Image.open(file_path)
    mask_image = Image.new(mode="RGB", size=(img.width, img.height))

    # Set it to black
    numpydata = asarray(mask_image)
    numpydata = numpydata + 1
    numpydata = numpydata * 255

    # change the color in that region to black
    from_x = int(parameters.rectangle.min_x)
    from_y = int(parameters.rectangle.min_y)

    to_x = int(parameters.rectangle.max_x)
    to_y = int(parameters.rectangle.max_y)

    numpydata[from_y:to_y,from_x:to_x] = [0, 0, 0]
    result_image = Image.fromarray(numpydata)
    path_to_mask = f"{TMP_FOLDER}/lauzhack-{parameters.file_id}.mask.webp"
    result_image.save(path_to_mask)


    file_id = uuid.uuid4()
    output_file = f"{TMP_FOLDER}/lauszhack-{file_id}"
    prompt = f"a {parameters.replace_by.lower()}"
    run(prompt, file_path, path_to_mask, output_file)

    return {
        'output_file_id': file_id,
    }


@app.get("/ping")
async def ping():
    return {"msg": "Pong"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
