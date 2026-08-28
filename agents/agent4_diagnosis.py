from langchain_ollama import OllamaLLM

def diagnosis_agent(state: dict) -> dict:
    vision = state["context"].get("vision_agent", "N/A")
    doc = state["context"].get("document_agent", "N/A")
    past = state["context"].get("knowledge_agent", "N/A")

    llm = OllamaLLM(model="gemma2:2b")

    prompt = f"""
You are an expert industrial fault diagnosis system.

Visual Inspection Result:
{vision}

Manual Reference:
{doc}

Past Similar Cases:
{past}

Based on all three sources above, provide:
FAULT TYPE: [specific fault name]
SEVERITY: [Low / Medium / High / Critical]
ROOT CAUSE: [what caused this fault]
IMMEDIATE ACTION: [what to do right now]
ESTIMATED DOWNTIME: [how long to fix]
"""
    diagnosis = llm.invoke(prompt)
    return {
        "agent_name": "diagnosis_agent",
        "output": diagnosis,
        "status": "success"
    }

if __name__ == "__main__":
    test_state = {
        "input": "Machine grinding noise",
        "image_path": "",
        "context": {
            "vision_agent": "Visible cracks on belt joint",
            "document_agent": "Belt failure caused by overload",
            "knowledge_agent": "Past case: belt replaced in 2hrs"
        }
    }
    result = diagnosis_agent(test_state)
    print(result["output"])