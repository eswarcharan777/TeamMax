from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_chroma import Chroma


# ============================================================
# 1. LOAD PDF
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

pdf_path = BASE_DIR / "industrial_manual.pdf"

loader = PyPDFLoader(str(pdf_path))

documents = loader.load()

print("PDF loaded successfully!")
print("Number of pages:", len(documents))

print("\nFirst page content:")
print(documents[0].page_content[:1000])


# ============================================================
# 2. SPLIT PDF INTO CHUNKS
# ============================================================

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

chunks = text_splitter.split_documents(documents)

print("\nPDF split successfully!")
print("Number of chunks:", len(chunks))

print("\nFirst chunk:")
print(chunks[0].page_content[:500])


# ============================================================
# 3. CREATE OLLAMA EMBEDDINGS
# ============================================================

embedding_model = OllamaEmbeddings(
    model="nomic-embed-text"
)

print("\nOllama embedding model loaded successfully!")


# ============================================================
# 4. CREATE CHROMA VECTOR DATABASE
# ============================================================

persist_directory = str(BASE_DIR / "chroma_db")

vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embedding_model,
    persist_directory=persist_directory,
    collection_name="industrial_manual"
)

print("ChromaDB created successfully!")


# ============================================================
# 5. LOAD LLAMA 3.2
# ============================================================

llm = OllamaLLM(
    model="llama3.2"
)

print("Llama 3.2 loaded successfully!")


# ============================================================
# 6. USER QUERY
# ============================================================

user_query = input("\nEnter your question: ")


# ============================================================
# 7. RETRIEVE TOP-3 RELEVANT DOCUMENTS
# ============================================================

top_k = 3

results = vectorstore.similarity_search(
    user_query,
    k=top_k
)


# ============================================================
# 8. DISPLAY RETRIEVED CHUNKS
# ============================================================

print("\n" + "=" * 70)
print(f"TOP {top_k} RELEVANT RESULTS")
print("=" * 70)

for i, result in enumerate(results, start=1):

    print(f"\n--- Result {i} ---")

    print("Page:", result.metadata.get("page", "Unknown"))

    print("\nContent:")
    print(result.page_content)

    print("-" * 70)


# ============================================================
# 9. CREATE CONTEXT FOR LLAMA
# ============================================================

context = "\n\n".join(
    result.page_content
    for result in results
)


# ============================================================
# 10. ASK LLAMA 3.2
# ============================================================

prompt = f"""
You are an industrial equipment document assistant.

Answer the user's question based ONLY on the provided
manual context.

Use the retrieved information to give a clear and useful answer.

If the question is broad, summarize the relevant information
from the context.

If the information is genuinely not present in the context,
say:
"I could not find this information in the manual."

Do not invent technical specifications, pressure limits,
maintenance procedures, or safety requirements.

MANUAL CONTEXT:
{context}

USER QUESTION:
{user_query}

ANSWER:
"""

# ============================================================
# 11. GENERATE FINAL ANSWER
# ============================================================

print("\n" + "=" * 70)
print("LLAMA 3.2 ANSWER")
print("=" * 70)

answer = llm.invoke(prompt)

print("\n" + answer)