from langgraph.graph import StateGraph, END
from typing import TypedDict
from vision_agent import vision_agent
from agent3_document import document_agent
from knowledge_agent import knowledge_agent
from agent4_diagnosis import diagnosis_agent
from agent6_alert import alert_agent
from agent5_report import report_agent

class State(TypedDict):
    input: str
    image_path: str
    context: dict

def run_vision(state):
    r = vision_agent(state)
    state["context"]["vision_agent"] = r["output"]
    return state

def run_document(state):
    r = document_agent(state)
    state["context"]["document_agent"] = r["output"]
    return state

def run_knowledge(state):
    r = knowledge_agent(state)
    state["context"]["knowledge_agent"] = r["output"]
    return state

def run_diagnosis(state):
    r = diagnosis_agent(state)
    state["context"]["diagnosis_agent"] = r["output"]
    return state

def run_alert(state):
    alert_agent(state)
    return state

def run_report(state):
    r = report_agent(state)
    state["context"]["report_agent"] = r["output"]
    return state

graph = StateGraph(State)
graph.add_node("vision", run_vision)
graph.add_node("document", run_document)
graph.add_node("knowledge", run_knowledge)
graph.add_node("diagnosis", run_diagnosis)
graph.add_node("alert", run_alert)
graph.add_node("report", run_report)

graph.set_entry_point("vision")
graph.add_edge("vision", "document")
graph.add_edge("document", "knowledge")
graph.add_edge("knowledge", "diagnosis")
graph.add_edge("diagnosis", "alert")
graph.add_edge("alert", "report")
graph.add_edge("report", END)

app = graph.compile()
print("Full pipeline compiled successfully!")