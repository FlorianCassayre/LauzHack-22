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
from classifier.yolov5 import yolov5
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
    file_path = f"{TMP_FOLDER}/lauzhack-{file_id}.jpg"

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
        'file_id': file_id,
    }

@app.get("/file")
async def getfile(fileId: str):
    file_path = f"{TMP_FOLDER}/lauzhack-{fileId}.jpg"
    print("Check", file_path)

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

def add_margin(pil_img, new_width, new_height):
    result = Image.new(pil_img.mode, (new_width, new_height), (0, 0, 0))
    result.paste(pil_img, (0, 0))
    return result

@app.post("/replace")
async def postFile(parameters: Body):
    file_path = f"{TMP_FOLDER}/lauzhack-{parameters.file_id}.jpg"
    print("Create mask")
    img = Image.open(file_path)
    print(f"old_width={img.width} old_height={img.height}")

    # old_width = img.width
    # old_height = img.height
    #
    # new_width = img.width
    # new_height = img.height
    #
    # if img.width % 64 != 0:
    #     new_width = img.width + (64 - img.width % 64)
    #
    # if img.height % 64 != 0:
    #     new_height = img.height + (64 - img.height % 64)

    # img = add_margin(img, new_height, new_width )
    # print(f"tmp_width={img.width} tmp_height={img.height}")
    # img = img.convert('RGB')
    # img.save(file_path)
    # print(f"new_width={new_width} new_height={new_height}")
    #
    # mask_image = Image.new(mode="RGB", size=(new_width, new_height))
    # Set it to black
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
    print(f"Output file is {file_id}")
    output_file = f"{TMP_FOLDER}/lauzhack-{file_id}.jpg"
    prompt = f"a {parameters.replace_by.lower()}"

    print("Diffuse bro")
    run(prompt, file_path, path_to_mask, output_file)

    ## resize back
    # if new_width != img.width or new_height != img.height:
    #     print("Resize back bro")
    #     new_file = Image.open(output_file)
    #     print(new_file.width, new_file.height)
    #     new_file = add_margin(new_file, old_height, old_width)
    #     new_file = new_file.convert('RGB')
    #
    #     print("Après", new_file.width, new_file.height)
    #     new_file.save(output_file)

    return {
        'file_id': file_id,
    }

@app.get("/classification")
async def classification(fileId: str):
    file_path = f"{TMP_FOLDER}/lauzhack-{fileId}.jpg"
    isExist = os.path.exists(file_path)
    if (isExist):
        return yolov5(file_path)
    else:
        raise HTTPException(status_code=404)

@app.get("/ping")
async def ping():
    return {"msg": "Pong"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
