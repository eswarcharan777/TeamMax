from fastapi import FastAPI
from pydantic import BaseModel
from agents.agent1_orchestrator import app as pipeline

server = FastAPI()

class UserInput(BaseModel):
    input: str
    image_path: str

@server.post("/run")
def run_pipeline(data: UserInput):
    result = pipeline.invoke({
        "input": data.input,
        "image_path": data.image_path,
        "context": {}
    })
    return result["context"]
