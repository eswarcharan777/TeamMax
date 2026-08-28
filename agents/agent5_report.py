from langchain_ollama import OllamaLLM
from datetime import datetime

def report_agent(state: dict) -> dict:
    diagnosis = state["context"].get("diagnosis_agent", "No diagnosis available")
    user_input = state.get("input", "Unknown issue")
    language = state.get("language", "english").lower()

    now = datetime.now()
    llm_report = OllamaLLM(model="gemma2:2b")      # fast — English report
    llm_translate = OllamaLLM(model="llama3.2")     # better — translation

    english_prompt = f"""
Generate a professional industrial fault report in English.

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

    english_report = llm_report.invoke(english_prompt)

    if language != "english":
        lang_map = {
            "telugu": "Telugu (తెలుగు)",
            "hindi": "Hindi (हिंदी)"
        }
        lang_label = lang_map.get(language, language)

        translate_prompt = f"""Translate the following industrial fault report to {lang_label}.

Rules:
- Keep all technical terms, measurements, and numbers in English
- Maintain the same section headers and structure
- Do not add explanations or commentary
- Output only the translated report

REPORT:
{english_report}
"""
        final_report = llm_translate.invoke(translate_prompt)
    else:
        final_report = english_report

    filename = f"report_{now.strftime('%Y%m%d%H%M')}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(final_report)

    return {
        "agent_name": "report_agent",
        "output": final_report,
        "english_output": english_report,
        "status": "success"
    }


if __name__ == "__main__":
    test_state = {
        "input": "Conveyor belt making noise",
        "image_path": "",
        "language": "telugu",
        "context": {
            "diagnosis_agent": "Fault: Belt wear | Severity: High | Action: Replace"
        }
    }
    result = report_agent(test_state)
    print("\n========== GENERATED REPORT ==========\n")
    print(result["output"])