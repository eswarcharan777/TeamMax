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
    language: str  # ← NEW
    context: dict

def run_vision(state):
    r = vision_agent(state)
    state["context"]["vision_agent"] = r["output"]
    if r.get("status") == "rejected":
        state["context"]["__rejected__"] = True
    return state

def run_document(state):
    if state["context"].get("__rejected__"):
        return state
    r = document_agent(state)
    state["context"]["document_agent"] = r["output"]
    return state

def run_knowledge(state):
    if state["context"].get("__rejected__"):
        return state
    r = knowledge_agent(state)
    state["context"]["knowledge_agent"] = r["output"]
    return state

def run_diagnosis(state):
    if state["context"].get("__rejected__"):
        return state
    r = diagnosis_agent(state)
    state["context"]["diagnosis_agent"] = r["output"]
    return state

def run_alert(state):
    if state["context"].get("__rejected__"):
        state["context"]["alert_agent"] = "⚠️ INVALID IMAGE — No industrial equipment detected."
        return state
    alert_agent(state)  # language is in state, alert_agent reads it
    return state

def run_report(state):
    if state["context"].get("__rejected__"):
        vision_msg = state["context"].get("vision_agent", "No equipment detected.")
        state["context"]["report_agent"] = (
            "❌ DIAGNOSIS ABORTED\n\n"
            f"{vision_msg}\n\n"
            "Please upload a clear image of industrial machinery or equipment and try again."
        )
        return state
    r = report_agent(state)  # language is in state, report_agent reads it
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