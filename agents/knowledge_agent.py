import chromadb
from datetime import datetime

# Initialize persistent local storage in the ./fault_db folder
client = chromadb.PersistentClient(path="./fault_db")
collection = client.get_or_create_collection(name="fault_history")

def knowledge_agent(state: dict) -> dict:
    """
    Knowledge Base Agent:
    1. Searches past fault cases matching state['input'].
    2. If diagnosis is present in context, saves the case for future retrieval.
    """
    current_input = state.get("input", "")
    context = state.get("context", {})
    diagnosis = context.get("diagnosis_agent", "")

    # Step 1: Search for similar past cases
    past_cases = "No similar past cases found."
    try:
        results = collection.query(
            query_texts=[current_input],
            n_results=3
        )
        if results.get("documents") and results["documents"][0]:
            past_cases = "\n".join(results["documents"][0])
    except Exception as e:
        past_cases = f"Search error: {str(e)}"

    # Step 2: Store the case once diagnosis is completed
    if diagnosis:
        case_id = f"case_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        collection.add(
            documents=[f"Input: {current_input} | Diagnosis: {diagnosis}"],
            ids=[case_id]
        )

    return {
        "agent_name": "knowledge_agent",
        "output": past_cases,
        "status": "success"
    }

# STANDALONE TEST
if __name__ == "__main__":
    print("--- Running Knowledge Base Agent Standalone Test ---")
    
    # 1. Add a sample fault case to ChromaDB
    collection.add(
        documents=["Input: belt noise | Diagnosis: Belt wear, High severity"],
        ids=["test_case_001"]
    )
    print("Added sample test case.")

    # 2. Test query with a similar symptom
    test_state = {
        "input": "conveyor belt vibrating",
        "image_path": "",
        "context": {
            "diagnosis_agent": ""
        }
    }
    
    result = knowledge_agent(test_state)
    print("\nSearch Results (Top Matches):")
    print(result["output"])