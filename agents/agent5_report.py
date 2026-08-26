from langchain_ollama import OllamaLLM
from datetime import datetime


def report_agent(state: dict) -> dict:

    diagnosis = state["context"].get(
        "diagnosis_agent",
        "No diagnosis available"
    )

    user_input = state.get(
        "input",
        "Unknown issue"
    )

    now = datetime.now()

    llm = OllamaLLM(model="llama3.2")

    prompt = f"""
Generate a professional industrial fault report.

========== FAULT REPORT ==========

Date: {now.strftime("%Y-%m-%d %H:%M")}
Report ID: FR-{now.strftime("%Y%m%d%H%M")}
Reported By: Field Worker

Issue Reported:
{user_input}

DIAGNOSIS:
{diagnosis}

RECOMMENDED ACTIONS:
Provide 3-4 specific corrective actions based on the diagnosis.

PRIORITY LEVEL:
Choose one: Immediate / Scheduled / Monitor

ESTIMATED FIX TIME:
Give a reasonable estimate.

===================================

Make the report professional, clear, and suitable for an industrial maintenance team.
"""

    report = llm.invoke(prompt)

    filename = f"report_{now.strftime('%Y%m%d%H%M')}.txt"

    with open(filename, "w", encoding="utf-8") as f:
        f.write(report)

    return {
        "agent_name": "report_agent",
        "output": report,
        "status": "success"
    }


# TEST STANDALONE
if __name__ == "__main__":

    test_state = {
        "input": "Conveyor belt making noise",

        "image_path": "",

        "context": {
            "diagnosis_agent":
                "Fault: Belt wear | Severity: High | Action: Replace"
        }
    }

    result = report_agent(test_state)

    print("\n========== GENERATED REPORT ==========\n")
    print(result["output"])