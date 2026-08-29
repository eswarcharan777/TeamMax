import sys
sys.path.insert(0, "agents")

import os
import io
import shutil
import json
import uuid
from datetime import datetime
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT

server = FastAPI()

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

class UserInput(BaseModel):
    input: str
    image_path: str
    language: str = "english"

@server.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"image_path": file_path}

@server.post("/run")
def run_pipeline(data: UserInput):
    from agent1_orchestrator import app
    result = app.invoke({
        "input": data.input,
        "image_path": data.image_path,
        "language": data.language,
        "context": {}
    })
    context = result["context"]

    report_id = str(uuid.uuid4())[:8]
    report = {
        "id": report_id,
        "timestamp": datetime.now().isoformat(),
        "input": data.input,
        "image_path": data.image_path,
        "language": data.language,
        "result": context
    }
    with open(os.path.join(REPORTS_DIR, f"{report_id}.json"), "w") as f:
        json.dump(report, f, indent=2)

    return context

def generate_stream(data: UserInput):
    from agent1_orchestrator import app
    initial_state = {
        "input": data.input,
        "image_path": data.image_path,
        "language": data.language,
        "context": {}
    }
    final_context = {}

    for chunk in app.stream(initial_state):
        node_name = list(chunk.keys())[0]
        state = chunk[node_name]
        final_context = state.get("context", {})
        yield f"data: {json.dumps({'agent': node_name, 'status': 'done'})}\n\n"

    report_id = str(uuid.uuid4())[:8]
    report = {
        "id": report_id,
        "timestamp": datetime.now().isoformat(),
        "input": data.input,
        "image_path": data.image_path,
        "language": data.language,
        "result": final_context
    }
    with open(os.path.join(REPORTS_DIR, f"{report_id}.json"), "w") as f:
        json.dump(report, f, indent=2)

    yield f"data: {json.dumps({'agent': '__done__', 'result': final_context, 'report_id': report_id})}\n\n"

@server.post("/run-stream")
def run_pipeline_stream(data: UserInput):
    return StreamingResponse(generate_stream(data), media_type="text/event-stream")

@server.get("/reports")
def list_reports():
    reports = []
    for filename in sorted(os.listdir(REPORTS_DIR), reverse=True):
        if filename.endswith(".json"):
            with open(os.path.join(REPORTS_DIR, filename)) as f:
                data = json.load(f)
                alert = data.get("result", {}).get("alert_agent", "")
                reports.append({
                    "id": data["id"],
                    "timestamp": data["timestamp"],
                    "input": data["input"],
                    "image_path": data.get("image_path", ""),
                    "language": data.get("language", "english"),
                    "result": {"alert_agent": alert}
                })
    return reports

@server.get("/reports/{report_id}")
def get_report(report_id: str):
    path = os.path.join(REPORTS_DIR, f"{report_id}.json")
    if not os.path.exists(path):
        return {"error": "Report not found"}
    with open(path) as f:
        return json.load(f)

def build_pdf(report_data: dict) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=2*cm, bottomMargin=2*cm
    )

    ORANGE = colors.HexColor("#f97316")
    GRAY   = colors.HexColor("#7d8590")

    title_style   = ParagraphStyle("title", fontSize=20, fontName="Helvetica-Bold", textColor=ORANGE, alignment=TA_CENTER, spaceAfter=6)
    sub_style     = ParagraphStyle("sub", fontSize=10, fontName="Helvetica", textColor=GRAY, alignment=TA_CENTER, spaceAfter=4)
    section_style = ParagraphStyle("section", fontSize=11, fontName="Helvetica-Bold", textColor=ORANGE, spaceBefore=14, spaceAfter=6)
    body_style    = ParagraphStyle("body", fontSize=9, fontName="Helvetica", textColor=colors.HexColor("#333333"), leading=14, spaceAfter=4)

    result      = report_data.get("result", {})
    report_text = result.get("report_agent", "No report generated.")
    alert_text  = result.get("alert_agent", "")
    timestamp   = report_data.get("timestamp", "")
    desc        = report_data.get("input", "")
    rid         = report_data.get("id", "")
    language    = report_data.get("language", "english").upper()

    severity = "UNKNOWN"
    color_map = {"CRITICAL": colors.HexColor("#ef4444"), "HIGH": colors.HexColor("#f97316"),
                 "WARNING": colors.HexColor("#eab308"), "LOW": colors.HexColor("#22c55e")}
    for s in ["CRITICAL", "HIGH", "WARNING", "LOW"]:
        if s in (alert_text + report_text).upper():
            severity = s
            break
    sev_color = color_map.get(severity, GRAY)

    elements = []
    elements.append(Paragraph("TeamMAX", title_style))
    elements.append(Paragraph(f"Industrial Fault Diagnosis System · {language}", sub_style))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(HRFlowable(width="100%", thickness=1, color=ORANGE))
    elements.append(Spacer(1, 0.3*cm))

    meta = [
        ["Report ID", f"#{rid}", "Timestamp", timestamp[:19].replace("T", " ")],
        ["Severity",  severity,  "Description", desc[:80] + ("..." if len(desc) > 80 else "")],
    ]
    t = Table(meta, colWidths=[3*cm, 4*cm, 3*cm, 7*cm])
    t.setStyle(TableStyle([
        ("FONTNAME",  (0,0), (-1,-1), "Helvetica"),
        ("FONTSIZE",  (0,0), (-1,-1), 8),
        ("FONTNAME",  (0,0), (0,-1), "Helvetica-Bold"),
        ("FONTNAME",  (2,0), (2,-1), "Helvetica-Bold"),
        ("TEXTCOLOR", (0,0), (0,-1), ORANGE),
        ("TEXTCOLOR", (2,0), (2,-1), ORANGE),
        ("TEXTCOLOR", (1,1), (1,1), sev_color),
        ("ROWBACKGROUNDS", (0,0), (-1,-1), [colors.HexColor("#f9f9f9"), colors.white]),
        ("GRID",      (0,0), (-1,-1), 0.5, colors.HexColor("#dddddd")),
        ("PADDING",   (0,0), (-1,-1), 6),
        ("VALIGN",    (0,0), (-1,-1), "MIDDLE"),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 0.4*cm))

    if alert_text:
        elements.append(Paragraph("Alert Status", section_style))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
        elements.append(Spacer(1, 0.2*cm))
        for line in alert_text.split("\n"):
            if line.strip():
                elements.append(Paragraph(line.strip(), body_style))
        elements.append(Spacer(1, 0.3*cm))

    elements.append(Paragraph("Full Diagnosis Report", section_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
    elements.append(Spacer(1, 0.2*cm))
    for line in report_text.split("\n"):
        stripped = line.strip()
        if not stripped:
            elements.append(Spacer(1, 0.15*cm))
        elif stripped.startswith("**") and stripped.endswith("**"):
            elements.append(Paragraph(stripped.replace("**", ""), section_style))
        else:
            elements.append(Paragraph(stripped, body_style))

    elements.append(Spacer(1, 0.5*cm))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
    elements.append(Paragraph(
        f"Generated by TeamMAX · SIH 2026 · {timestamp[:10]}",
        ParagraphStyle("footer", fontSize=8, textColor=GRAY, alignment=TA_CENTER, spaceBefore=6)
    ))

    doc.build(elements)
    buffer.seek(0)
    return buffer.read()

@server.get("/reports/{report_id}/pdf")
def download_pdf(report_id: str):
    path = os.path.join(REPORTS_DIR, f"{report_id}.json")
    if not os.path.exists(path):
        return Response(content="Report not found", status_code=404)
    with open(path) as f:
        report_data = json.load(f)
    pdf_bytes = build_pdf(report_data)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=fault_report_{report_id}.pdf"}
    )