from langgraph.graph import StateGraph, END
from typing import TypedDict

class State(TypedDict):
    input: str
    image_path: str
    context: dict

def run_vision(state):
    state['context']['vision_agent'] = "vision output placeholder"
    return state

def run_document(state):
    state['context']['document_agent'] = "document output placeholder"
    return state

def run_knowledge(state):
    state['context']['knowledge_agent'] = "knowledge output placeholder"
    return state

def run_diagnosis(state):
    state['context']['diagnosis_agent'] = "diagnosis output placeholder"
    return state

def run_report(state):
    state['context']['report_agent'] = "final report placeholder"
    return state

graph = StateGraph(State)
graph.add_node('vision', run_vision)
graph.add_node('document', run_document)
graph.add_node('knowledge', run_knowledge)
graph.add_node('diagnosis', run_diagnosis)
graph.add_node('report', run_report)

graph.set_entry_point('vision')
graph.add_edge('vision', 'document')
graph.add_edge('document', 'knowledge')
graph.add_edge('knowledge', 'diagnosis')
graph.add_edge('diagnosis', 'report')
graph.add_edge('report', END)

app = graph.compile()
print("Pipeline compiled successfully!")
