from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_chroma import Chroma

BASE_DIR = Path(__file__).resolve().parent.parent

def document_agent(state: dict) -> dict:
    try:
        user_query = state.get('input', '')

        # 1. Load PDF
        pdf_path = BASE_DIR / "industrial_manual.pdf"
        loader = PyPDFLoader(str(pdf_path))
        documents = loader.load()

        # 2. Split into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        chunks = text_splitter.split_documents(documents)

        # 3. Embeddings
        embedding_model = OllamaEmbeddings(model="nomic-embed-text")

        # 4. ChromaDB
        persist_directory = str(BASE_DIR / "chroma_db")
        vectorstore = Chroma.from_documents(
            documents=chunks,
            embedding=embedding_model,
            persist_directory=persist_directory,
            collection_name="industrial_manual"
        )

        # 5. Load LLM
        llm = OllamaLLM(model="llama3.2")

        # 6. Retrieve top-3 relevant chunks
        results = vectorstore.similarity_search(user_query, k=3)
        context = "\n\n".join(r.page_content for r in results)

        # 7. Generate answer
        prompt = f"""
You are an industrial equipment document assistant.
Answer the user's question based ONLY on the provided manual context.
If not found, say: "I could not find this information in the manual."

MANUAL CONTEXT:
{context}

USER QUESTION:
{user_query}

ANSWER:
"""
        answer = llm.invoke(prompt)

        return {
            'agent_name': 'document_agent',
            'output': answer,
            'status': 'success'
        }

    except Exception as e:
        return {
            'agent_name': 'document_agent',
            'output': f'Error: {str(e)}',
            'status': 'failed'
        }

# Standalone test
if __name__ == '__main__':
    test_state = {'input': 'What are the maintenance steps?'}
    result = document_agent(test_state)
    print(result['output'])
