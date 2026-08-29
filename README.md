

🔧 TeamMAX — Industrial Fault Diagnosis System

AI-powered multi-agent system for real-time industrial fault detection, diagnosis, and reporting.



Show Image Show Image Show Image Show Image



🚀 What is TeamMAX?

TeamMAX is an AI-powered industrial fault diagnosis system built for Smart India Hackathon 2026. It takes an image of industrial equipment and a problem description, runs it through a 6-agent AI pipeline, and generates a professional fault report — in English, Telugu, or Hindi.



🧠 6-Agent Pipeline

Vision → Document → Knowledge → Diagnosis → Alert → Report

Agent	Role	Model

Vision Agent	Analyzes equipment image, detects faults visually	LLaVA

Document Agent	Retrieves relevant maintenance documents from PDF manual	Gemma2:2b

Knowledge Agent	Retrieves similar past fault cases from ChromaDB	No LLM

Diagnosis Agent	Determines fault type and severity	Gemma2:2b

Alert Agent	Generates priority alert in selected language	Template-based

Report Agent	English report → translates to Telugu/Hindi if needed	Gemma2:2b + LLaMA 3.2

✨ Features

📸 Image-based fault detection — upload a photo of any industrial equipment

🤖 6-agent LangGraph pipeline — modular, sequential AI analysis

🌐 Multi-language reports — English, Telugu (తెలుగు), Hindi (हिंदी)

📄 PDF \& TXT export — download professional reports instantly

📊 Statistics dashboard — severity breakdown, 7-day activity chart

📁 Report history — all diagnoses saved and accessible

⚡ Real-time streaming — live agent pipeline progress with timer

🎯 Animated pipeline UI — circular agent indicators with spinning gear + smoke effects

🔒 Fully offline — runs locally using Ollama (no data leaves your machine)

🛠️ Tech Stack

Layer	Technology

Backend	FastAPI + Python 3.11

AI Orchestration	LangGraph

LLM Runtime	Ollama (local)

Vision Model	LLaVA

Report Model	Gemma2:2b (faster generation)

Translation Model	LLaMA 3.2 (better Telugu/Hindi quality)

Vector Database	ChromaDB (RAG for manuals + past cases)

Embeddings	nomic-embed-text

Frontend	React

PDF Generation	ReportLab

📁 Project Structure

TeamMax/

├── main.py                    # FastAPI server

├── agents/

│   ├── agent1\_orchestrator.py # LangGraph pipeline

│   ├── vision\_agent.py        # Image analysis (LLaVA)

│   ├── agent3\_document.py     # PDF manual RAG search

│   ├── knowledge\_agent.py     # ChromaDB past case retrieval

│   ├── agent4\_diagnosis.py    # Fault diagnosis

│   ├── agent6\_alert.py        # Multilingual alert templates

│   ├── agent5\_report.py       # English report + translation

│   └── industrial\_manual.pdf  # Industrial maintenance reference

├── uploads/                   # Uploaded machine images

├── reports/                   # Generated JSON reports

└── frontend/

&#x20;   └── src/App.js             # React UI with pipeline animation

⚙️ Setup \& Installation

Prerequisites

Python 3.11+

Ollama installed

Node.js (for frontend)

1\. Clone the repo

git clone https://github.com/eswarcharan777/TeamMax.git

cd TeamMax

2\. Install Python dependencies

pip install fastapi uvicorn langchain-ollama langgraph reportlab ollama chromadb langchain-community langchain-chroma

3\. Pull required Ollama models

ollama pull llama3.2

ollama pull llava

ollama pull gemma2:2b

ollama pull nomic-embed-text

4\. Start the backend

py -m uvicorn main:server --reload

5\. Start the frontend

cd frontend

npm install

npm start

🖥️ Usage

Open the app in your browser at http://localhost:3000

Select report language (English / Telugu / Hindi)

Upload an image of the faulty equipment

Describe the problem

Click Run Diagnosis

Watch the 6-agent pipeline run in real-time

Download the generated PDF or TXT report

🌍 Multi-Language Support

TeamMAX uses a two-step approach (Option A) for multilingual reports:



Step 1 — Generate full report in English (best LLM quality, using Gemma2:2b)

Step 2 — If Telugu/Hindi selected, translate using LLaMA 3.2 (better multilingual quality)

Why two steps? Local models generate better structured content in English. Translation is a simpler task — faster and cleaner output.



🎨 UI Features

Circular agent pipeline — each agent shown as a circle with spinning ⚙️ gear + smoke animation while running

Green ring on completed agents, orange spinning arc on active agent

Progress bar with percentage while running

Live timer showing total diagnosis time

Statistics tab — severity breakdown (Critical/High/Warning/Low) + 7-day activity chart

🌐 API Endpoints

Method	Endpoint	Description

POST	/upload	Upload equipment image

POST	/run	Run full diagnosis pipeline

POST	/run-stream	Streaming diagnosis (real-time)

GET	/reports	List all reports with severity

GET	/reports/{id}	Get specific report

GET	/reports/{id}/pdf	Download PDF report

👨‍💻 Team

Built for Smart India Hackathon 2026 | KL University, Vijayawada



Name	Department

S. Eswar Charan (Team Lead)	AI \& Data Science

Mungamuri Sriman Reddy	CSE

Dunna Ajay	CSE

Mungamuri Neha Namitha	CSE

Meka Bala Dhanush Kumar	AI \& Data Science

Chebrolu Prudhvi Raj Sai Sri Vatsav	AI \& Data Science

GitHub: @eswarcharan777

LinkedIn: linkedin.com/in/eswarcharan



📄 License

MIT License — free to use and modify.





