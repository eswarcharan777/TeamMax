import sys
sys.path.insert(0, "agents")

import os
import shutil
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

server = FastAPI()

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UserInput(BaseModel):
    input: str
    image_path: str

@server.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"image_path": file_path}

@server.post("/run")
def run_pipeline(data: UserInput):
    from agent1_orchestrator import app
    result = app.invoke({
        "input": data.input,
        "image_path": data.image_path,
        "context": {}
    })
    return result["context"]