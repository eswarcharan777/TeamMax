# 🔧 TeamMAX — Industrial Fault Diagnosis System

> AI-powered multi-agent system for real-time industrial fault detection, diagnosis, and reporting.

![SIH 2026](https://img.shields.io/badge/SIH-2026-orange) ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green) ![LangGraph](https://img.shields.io/badge/LangGraph-latest-blue) ![Ollama](https://img.shields.io/badge/Ollama-local-purple)

---

## 🚀 What is TeamMAX?

TeamMAX is an **AI-powered industrial fault diagnosis system** built for Smart India Hackathon 2026. It takes an image of industrial equipment and a problem description, runs it through a **6-agent AI pipeline**, and generates a professional fault report — in **English, Telugu, or Hindi**.

---

## 🧠 6-Agent Pipeline

```
Vision → Document → Knowledge → Diagnosis → Alert → Report
```

| Agent | Role | Model |
|-------|------|-------|
| **Vision Agent** | Analyzes equipment image, detects faults visually | LLaVA |
| **Document Agent** | Retrieves relevant maintenance documents | LLaMA 3.2 |
| **Knowledge Agent** | Applies domain knowledge for context | LLaMA 3.2 |
| **Diagnosis Agent** | Determines fault type and severity | LLaMA 3.2 |
| **Alert Agent** | Generates priority alert status | LLaMA 3.2 |
| **Report Agent** | Produces full professional fault report | LLaMA 3.2 |

---

## ✨ Features

- 📸 **Image-based fault detection** — upload a photo of any industrial equipment
- 🤖 **6-agent LangGraph pipeline** — modular, sequential AI analysis
- 🌐 **Multi-language reports** — English, Telugu (తెలుగు), Hindi (हिंदी)
- 📄 **PDF & TXT export** — download professional reports instantly
- 📊 **Report history** — all diagnoses saved and accessible
- ⚡ **Streaming responses** — real-time agent progress updates
- 🔒 **Local AI** — runs fully offline using Ollama (no data leaves your machine)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python 3.11 |
| AI Orchestration | LangGraph |
| LLM Runtime | Ollama (local) |
| Vision Model | LLaVA |
| Language Model | LLaMA 3.2 |
| Frontend | React |
| PDF Generation | ReportLab |

---

## 📁 Project Structure

```
TeamMax/
├── main.py                    # FastAPI server
├── agents/
│   ├── agent1_orchestrator.py # LangGraph pipeline
│   ├── vision_agent.py        # Image analysis
│   ├── agent3_document.py     # Document retrieval
│   ├── knowledge_agent.py     # Knowledge base
│   ├── agent4_diagnosis.py    # Fault diagnosis
│   ├── agent6_alert.py        # Alert generation
│   └── agent5_report.py       # Report generation + translation
├── uploads/                   # Uploaded machine images
├── reports/                   # Generated JSON reports
└── frontend/                  # React UI
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.11+
- [Ollama](https://ollama.ai) installed
- Node.js (for frontend)

### 1. Clone the repo
```bash
git clone https://github.com/eswarcharan777/TeamMax.git
cd TeamMax
```

### 2. Install Python dependencies
```bash
pip install fastapi uvicorn langchain-ollama langgraph reportlab ollama
```

### 3. Pull required Ollama models
```bash
ollama pull llama3.2
ollama pull llava
```

### 4. Start the backend
```bash
py -m uvicorn main:server --reload
```

### 5. Start the frontend
```bash
cd frontend
npm install
npm start
```

---

## 🖥️ Usage

1. Open the app in your browser
2. Select report language (English / Telugu / Hindi)
3. Upload an image of the faulty equipment
4. Describe the problem
5. Click **Run Diagnosis**
6. Download the generated PDF report

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload equipment image |
| `POST` | `/run` | Run full diagnosis pipeline |
| `POST` | `/run-stream` | Streaming diagnosis (real-time) |
| `GET` | `/reports` | List all reports |
| `GET` | `/reports/{id}` | Get specific report |
| `GET` | `/reports/{id}/pdf` | Download PDF report |

---

## 🌍 Multi-Language Support

TeamMAX generates reports in 3 languages using a **two-step approach**:
1. Generate report in English (best LLM quality)
2. Translate to Telugu/Hindi if selected (faster, cleaner output)

---

## 👨‍💻 Team

Built for **Smart India Hackathon 2026**

**S. Eswar Charan** — AI & Data Science, KL University  
GitHub: [@eswarcharan777](https://github.com/eswarcharan777)  
LinkedIn: [linkedin.com/in/eswarcharan](https://linkedin.com/in/eswarcharan)

---

## 📄 License

MIT License — free to use and modify.
