import { useState, useEffect, useRef } from "react";

const styles = {
  root: { minHeight: "100vh", background: "#0d1117", color: "#e6edf3", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  header: { background: "#161b22", borderBottom: "1px solid #21262d", padding: "16px 40px", display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 36, height: 36, background: "linear-gradient(135deg, #f97316, #ef4444)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  headerTitle: { fontSize: 18, fontWeight: 700, color: "#e6edf3", margin: 0 },
  headerSub: { fontSize: 12, color: "#7d8590", margin: 0 },
  badge: { marginLeft: "auto", background: "#1f6feb22", border: "1px solid #1f6feb", color: "#58a6ff", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  main: { maxWidth: 900, margin: "0 auto", padding: "40px 24px" },
  hero: { textAlign: "center", marginBottom: 48 },
  heroTag: { display: "inline-block", background: "#f9731622", border: "1px solid #f97316", color: "#f97316", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 16, letterSpacing: 1 },
  heroTitle: { fontSize: 36, fontWeight: 800, margin: "0 0 12px", background: "linear-gradient(135deg, #e6edf3, #7d8590)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { color: "#7d8590", fontSize: 15, margin: 0 },
  card: { background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 28, marginBottom: 20 },
  cardTitle: { fontSize: 13, fontWeight: 600, color: "#7d8590", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 },
  uploadArea: { border: "2px dashed #21262d", borderRadius: 8, padding: "32px 20px", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s", position: "relative" },
  uploadAreaActive: { borderColor: "#f97316", background: "#f9731608" },
  fileInput: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" },
  uploadIcon: { fontSize: 32, marginBottom: 8 },
  uploadText: { color: "#7d8590", fontSize: 14 },
  uploadSelected: { display: "flex", alignItems: "center", gap: 10, background: "#1f6feb11", border: "1px solid #1f6feb44", borderRadius: 8, padding: "10px 14px", marginTop: 12 },
  textarea: { width: "100%", background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, color: "#e6edf3", fontSize: 14, padding: "12px 14px", resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6 },
  btn: { width: "100%", padding: "14px", background: "linear-gradient(135deg, #f97316, #ef4444)", border: "none", borderRadius: 8, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  reportCard: { background: "#161b22", border: "1px solid #21262d", borderRadius: 12, overflow: "hidden", marginTop: 28 },
  reportHeader: { background: "linear-gradient(135deg, #f9731622, #ef444411)", borderBottom: "1px solid #21262d", padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 },
  reportDot: { width: 10, height: 10, borderRadius: "50%", background: "#f97316", boxShadow: "0 0 8px #f97316" },
  reportTitle: { fontSize: 15, fontWeight: 700, color: "#e6edf3", margin: 0 },
  reportId: { marginLeft: "auto", fontSize: 12, color: "#7d8590" },
  reportBody: { padding: 24, whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.8, color: "#c9d1d9", fontFamily: "'Courier New', monospace" },
  spinner: { display: "inline-block", width: 16, height: 16, border: "2px solid #f9731633", borderTop: "2px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  downloadBtn: { marginTop: 12, padding: "10px 20px", background: "#21262d", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  pdfBtn: { marginTop: 12, marginLeft: 10, padding: "10px 20px", background: "#1f6feb22", border: "1px solid #1f6feb", borderRadius: 8, color: "#58a6ff", fontSize: 13, cursor: "pointer", fontWeight: 600 },
  tabBar: { display: "flex", gap: 8, marginBottom: 32, background: "#161b22", borderRadius: 10, padding: 6, border: "1px solid #21262d" },
  tab: { flex: 1, padding: "10px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, background: "transparent", color: "#7d8590", transition: "all 0.2s" },
  tabActive: { background: "linear-gradient(135deg, #f97316, #ef4444)", color: "white" },
  historyItem: { background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "16px 20px", marginBottom: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "border-color 0.2s" },
  historyItemHover: { borderColor: "#f97316" },
  historyId: { fontSize: 12, fontWeight: 700, color: "#f97316", minWidth: 80 },
  historyInput: { flex: 1, fontSize: 13, color: "#c9d1d9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  historyTime: { fontSize: 11, color: "#7d8590", minWidth: 140, textAlign: "right" },
  emptyState: { textAlign: "center", color: "#7d8590", padding: "60px 0", fontSize: 15 },
  backBtn: { background: "#21262d", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 13, cursor: "pointer", fontWeight: 600, padding: "8px 16px", marginBottom: 20 },
  modalOverlay: { position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modalBox: { background: "#161b22", border: "1px solid #21262d", borderRadius: 16, padding: 24, width: "90%", maxWidth: 560 },
  modalTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16, color: "#e6edf3" },
  video: { width: "100%", borderRadius: 10, background: "#000", marginBottom: 16 },
  camBtnRow: { display: "flex", gap: 10 },
  captureBtn: { flex: 1, padding: "12px", background: "linear-gradient(135deg, #f97316, #ef4444)", border: "none", borderRadius: 8, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  cancelBtn: { padding: "12px 20px", background: "#21262d", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 14, cursor: "pointer", fontWeight: 600 },
};

const AGENTS = ["vision", "document", "knowledge", "diagnosis", "alert", "report"];

const SEVERITY_CONFIG = {
  CRITICAL: { color: "#ef4444", bg: "#ef444411", label: "Critical" },
  HIGH:     { color: "#f97316", bg: "#f9731611", label: "High" },
  WARNING:  { color: "#eab308", bg: "#eab30811", label: "Warning" },
  LOW:      { color: "#22c55e", bg: "#22c55e11", label: "Low" },
  UNKNOWN:  { color: "#7d8590", bg: "#7d859011", label: "Unknown" },
};

const LANGUAGES = [
  { key: "english", label: "🇬🇧 English" },
  { key: "telugu",  label: "🇮🇳 తెలుగు" },
  { key: "hindi",   label: "🇮🇳 हिंदी" },
];

function getSeverity(report) {
  const text = (report.result?.alert_agent || "") + " " + (report.result?.report_agent || "");
  if (text.includes("CRITICAL")) return "CRITICAL";
  if (text.includes("HIGH") || text.includes("High")) return "HIGH";
  if (text.includes("WARNING") || text.includes("Warning") || text.includes("MEDIUM") || text.includes("Medium")) return "WARNING";
  if (text.includes("LOW") || text.includes("Low")) return "LOW";
  if (text.includes("అధికం") || text.includes("క్రిటికల్")) return "CRITICAL";
  if (text.includes("మధ్యస్థం")) return "WARNING";
  if (text.includes("తక్కువ")) return "LOW";
  if (text.includes("उच्च") || text.includes("गंभीर")) return "CRITICAL";
  if (text.includes("मध्यम")) return "WARNING";
  if (text.includes("कम")) return "LOW";
  return "UNKNOWN";
}

function AgentPipeline({ activeAgent, completedAgents, loading, elapsed }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "16px 20px", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#7d8590", letterSpacing: 1 }}>AGENT PIPELINE</span>
        {loading && (
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f97316", fontVariantNumeric: "tabular-nums" }}>
            ⏱ {String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}
          </span>
        )}
        {!loading && completedAgents.length === AGENTS.length && (
          <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>✓ Completed</span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
        {AGENTS.map((agent, i) => {
          const isCompleted = completedAgents.includes(agent);
          const isActive = activeAgent === i;
          const bgColor = isCompleted ? "#22c55e11" : isActive ? "#f9731618" : "#21262d";
          const textColor = isCompleted ? "#22c55e" : isActive ? "#f97316" : "#7d8590";

          return (
            <div key={agent} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>

                {/* Smoke particles */}
                <div style={{ height: 22, display: "flex", alignItems: "flex-end", gap: 3, justifyContent: "center" }}>
                  {isActive ? (
                    <>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f9731699", animation: "smoke1 1.4s ease-out infinite" }} />
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#f9731666", animation: "smoke2 1.4s ease-out infinite 0.35s" }} />
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#f9731644", animation: "smoke1 1.4s ease-out infinite 0.7s" }} />
                    </>
                  ) : <div style={{ width: 7, height: 7 }} />}
                </div>

                {/* Circle with spinning ring + spinning gear */}
                <div style={{ position: "relative", width: 64, height: 64 }}>
                  {/* SVG ring */}
                  <svg width="64" height="64" style={{ position: "absolute", top: 0, left: 0 }}>
                    {/* bg ring */}
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#30363d" strokeWidth="3" />
                    {/* active: spinning arc */}
                    {isActive && (
                      <circle
                        cx="32" cy="32" r="28"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="3"
                        strokeDasharray="50 126"
                        strokeLinecap="round"
                        style={{ animation: "ringRotate 0.9s linear infinite", transformOrigin: "32px 32px" }}
                      />
                    )}
                    {/* completed: full green ring */}
                    {isCompleted && (
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#22c55e" strokeWidth="3" />
                    )}
                  </svg>

                  {/* Center background + icon */}
                  <div style={{
                    position: "absolute",
                    top: 6, left: 6, right: 6, bottom: 6,
                    borderRadius: "50%",
                    background: bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <span style={{
                      fontSize: 22,
                      display: "inline-block",
                      animation: isActive ? "gearSpin 1s linear infinite" : "none",
                    }}>
                      {isCompleted ? "✅" : "⚙️"}
                    </span>
                  </div>
                </div>

                {/* Agent name + status */}
                <span style={{ fontSize: 11, fontWeight: 600, color: textColor, textTransform: "capitalize" }}>
                  {agent}
                </span>
                {isActive && <span style={{ fontSize: 9, color: "#f97316", fontWeight: 700, letterSpacing: 0.5 }}>RUNNING</span>}
                {isCompleted && <span style={{ fontSize: 9, color: "#22c55e", fontWeight: 700, letterSpacing: 0.5 }}>DONE</span>}
                {!isActive && !isCompleted && <span style={{ fontSize: 9, color: "#30363d", fontWeight: 700 }}>IDLE</span>}
              </div>

              {/* Arrow */}
              {i < AGENTS.length - 1 && (
                <div style={{ margin: "0 2px 24px", color: isCompleted ? "#22c55e" : "#30363d", fontSize: 20, fontWeight: 700, transition: "color 0.3s" }}>›</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatisticsTab({ reports }) {
  const total = reports.length;
  const counts = { CRITICAL: 0, HIGH: 0, WARNING: 0, LOW: 0, UNKNOWN: 0 };
  reports.forEach(r => { counts[getSeverity(r)]++; });
  const maxCount = Math.max(...Object.values(counts), 1);
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en", { weekday: "short" });
    const count = reports.filter(r => r.timestamp?.slice(0, 10) === key).length;
    return { label, count, key };
  });
  const maxDay = Math.max(...last7.map(d => d.count), 1);

  if (total === 0) return (
    <div style={styles.emptyState}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
      No data yet. Run a diagnosis first.
    </div>
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Reports", value: total, color: "#58a6ff", icon: "🗂️" },
          { label: "Critical Alerts", value: counts.CRITICAL + counts.HIGH, color: "#ef4444", icon: "🚨" },
          { label: "Resolved (Low)", value: counts.LOW, color: "#22c55e", icon: "✅" },
        ].map(s => (
          <div key={s.label} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: "20px 24px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#7d8590", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 28, marginBottom: 24 }}>
        <div style={styles.cardTitle}>📊 Severity Breakdown</div>
        {Object.entries(counts).map(([key, count]) => {
          const cfg = SEVERITY_CONFIG[key];
          const pct = Math.round((count / maxCount) * 100);
          return (
            <div key={key} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                <span style={{ fontSize: 13, color: "#7d8590" }}>{count} report{count !== 1 ? "s" : ""}</span>
              </div>
              <div style={{ background: "#21262d", borderRadius: 6, height: 10, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: cfg.color, borderRadius: 6, transition: "width 0.6s ease", boxShadow: `0 0 8px ${cfg.color}66` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, padding: 28 }}>
        <div style={styles.cardTitle}>📅 Last 7 Days Activity</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
          {last7.map(d => {
            const pct = Math.round((d.count / maxDay) * 100);
            return (
              <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 11, color: "#7d8590" }}>{d.count || ""}</span>
                <div style={{ width: "100%", height: d.count ? `${Math.max(pct, 8)}%` : 4, background: d.count ? "linear-gradient(180deg, #f97316, #ef4444)" : "#21262d", borderRadius: "4px 4px 0 0", transition: "height 0.6s ease", boxShadow: d.count ? "0 0 8px #f9731666" : "none" }} />
                <span style={{ fontSize: 11, color: "#7d8590" }}>{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("diagnose");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [input, setInput] = useState("");
  const [report, setReport] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [language, setLanguage] = useState("english");
  const [elapsed, setElapsed] = useState(0);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const [reports, setReports] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    if (loading) {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [loading]);

  const fetchReports = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("http://localhost:8000/reports");
      const data = await res.json();
      setReports(data);
    } catch { setReports([]); }
    setHistoryLoading(false);
  };

  const fetchReportDetail = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/reports/${id}`);
      const data = await res.json();
      setSelectedReport(data);
    } catch { setSelectedReport(null); }
  };

  useEffect(() => {
    if (tab === "history") { setSelectedReport(null); fetchReports(); }
    if (tab === "stats") { fetchReports(); }
  }, [tab]);

  const openCamera = async () => {
    setCameraError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setCameraError("Camera access denied or not available."); }
  };

  const closeCamera = () => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraOpen(false);
    setCameraError("");
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: "image/jpeg" });
      setImage(file);
      setImagePreview(canvas.toDataURL("image/jpeg"));
      closeCamera();
    }, "image/jpeg", 0.92);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!input || !image) { alert("Please provide both image and description"); return; }
    setLoading(true);
    setReport("");
    setAlertMsg("");
    setActiveAgent(0);
    setCompletedAgents([]);
    setCurrentReportId(null);
    try {
      const formData = new FormData();
      formData.append("file", image);
      const uploadRes = await fetch("http://localhost:8000/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();

      const response = await fetch("http://localhost:8000/run-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, image_path: uploadData.image_path, language }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.agent === "__done__") {
              setReport(json.result?.report_agent || JSON.stringify(json.result, null, 2));
              setAlertMsg(json.result?.alert_agent || "");
              setActiveAgent(-1);
              setCompletedAgents(AGENTS);
              setCurrentReportId(json.report_id);
            } else {
              const doneIndex = AGENTS.indexOf(json.agent);
              setCompletedAgents(prev => [...prev, json.agent]);
              setActiveAgent(doneIndex + 1 < AGENTS.length ? doneIndex + 1 : -1);
            }
          } catch { }
        }
      }
    } catch {
      setReport("Error: Could not connect to backend.");
      setActiveAgent(-1);
    }
    setLoading(false);
  };

  const handleDownload = (text, name) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = (id) => {
    window.open(`http://localhost:8000/reports/${id}/pdf`, "_blank");
  };

  const reportId = report.match(/FR-\d+/)?.[0] || "";
  const alertColor = alertMsg.includes("CRITICAL") ? "#ef4444" : alertMsg.includes("WARNING") ? "#f97316" : "#22c55e";
  const progressPct = Math.round((completedAgents.length / AGENTS.length) * 100);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes gearSpin { to { transform: rotate(360deg); } }
        @keyframes ringRotate { to { transform: rotate(360deg); } }
        @keyframes smoke1 {
          0%   { transform: translateY(0) scale(1); opacity: 0.9; }
          100% { transform: translateY(-20px) scale(2.2); opacity: 0; }
        }
        @keyframes smoke2 {
          0%   { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-26px) scale(2.8); opacity: 0; }
        }
        textarea:focus { border-color: #f97316 !important; }
      `}</style>
      <div style={styles.root}>

        {cameraOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
              <p style={styles.modalTitle}>📷 Capture Machine Image</p>
              {cameraError ? (
                <div style={{ color: "#ef4444", fontSize: 14, marginBottom: 16 }}>{cameraError}</div>
              ) : (
                <video ref={videoRef} autoPlay playsInline muted style={styles.video} />
              )}
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div style={styles.camBtnRow}>
                {!cameraError && <button onClick={capturePhoto} style={styles.captureBtn}>📸 Capture</button>}
                <button onClick={closeCamera} style={styles.cancelBtn}>✕ Cancel</button>
              </div>
            </div>
          </div>
        )}

        <header style={styles.header}>
          <div style={styles.logo}>⚙️</div>
          <div>
            <p style={styles.headerTitle}>TeamMAX</p>
            <p style={styles.headerSub}>Industrial Fault Diagnosis System</p>
          </div>
          <span style={styles.badge}>SIH 2026</span>
        </header>

        <main style={styles.main}>
          <div style={styles.tabBar}>
            <button style={{ ...styles.tab, ...(tab === "diagnose" ? styles.tabActive : {}) }} onClick={() => setTab("diagnose")}>⚡ New Diagnosis</button>
            <button style={{ ...styles.tab, ...(tab === "history" ? styles.tabActive : {}) }} onClick={() => setTab("history")}>🗂️ Report History</button>
            <button style={{ ...styles.tab, ...(tab === "stats" ? styles.tabActive : {}) }} onClick={() => setTab("stats")}>📊 Statistics</button>
          </div>

          {tab === "diagnose" && (
            <>
              <div style={styles.hero}>
                <span style={styles.heroTag}>AI-POWERED · 6 AGENTS</span>
                <h1 style={styles.heroTitle}>Diagnose Industrial Faults<br />in Seconds</h1>
                <p style={styles.heroSub}>Upload a machine image, describe the problem — get a full diagnostic report.</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, background: "#161b22", border: "1px solid #21262d", borderRadius: 10, padding: "12px 16px" }}>
                <span style={{ fontSize: 13, color: "#7d8590", fontWeight: 600 }}>🌐 Report Language:</span>
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.key}
                    onClick={() => setLanguage(lang.key)}
                    style={{
                      padding: "6px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600,
                      border: language === lang.key ? "1px solid #f97316" : "1px solid #30363d",
                      background: language === lang.key ? "#f9731622" : "#21262d",
                      color: language === lang.key ? "#f97316" : "#7d8590",
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <AgentPipeline
                activeAgent={activeAgent}
                completedAgents={completedAgents}
                loading={loading}
                elapsed={elapsed}
              />

              <div style={styles.card}>
                <div style={styles.cardTitle}>
                  📷 Machine Image
                  <div style={{ marginLeft: "auto" }}>
                    <button onClick={openCamera} style={{ padding: "4px 12px", background: "#f9731622", border: "1px solid #f97316", borderRadius: 6, color: "#f97316", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                      📸 Use Camera
                    </button>
                  </div>
                </div>
                <div style={{ ...styles.uploadArea, ...(image ? styles.uploadAreaActive : {}) }}>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
                  {!image ? (
                    <>
                      <div style={styles.uploadIcon}>🖼️</div>
                      <p style={styles.uploadText}>Click to upload or use camera above<br /><span style={{ fontSize: 12 }}>JPG, PNG supported</span></p>
                    </>
                  ) : (
                    <div>
                      {imagePreview && <img src={imagePreview} alt="preview" style={{ maxHeight: 160, borderRadius: 8, marginBottom: 10, maxWidth: "100%", objectFit: "contain" }} />}
                      <div style={styles.uploadSelected}>
                        <span>📎</span>
                        <span style={{ color: "#58a6ff", fontSize: 14 }}>{image.name}</span>
                        <span style={{ marginLeft: "auto", color: "#7d8590", fontSize: 12 }}>{(image.size / 1024).toFixed(0)} KB</span>
                        <button onClick={() => { setImage(null); setImagePreview(null); }} style={{ marginLeft: 8, background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>✕</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardTitle}>📝 Problem Description</div>
                <textarea rows={4} style={styles.textarea} placeholder="e.g. Bearing making unusual grinding noise, possible overheating since last shift..." value={input} onChange={(e) => setInput(e.target.value)} />
              </div>

              {loading && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#7d8590" }}>Processing agents...</span>
                    <span style={{ fontSize: 12, color: "#f97316", fontWeight: 700 }}>{progressPct}%</span>
                  </div>
                  <div style={{ background: "#21262d", borderRadius: 6, height: 8, overflow: "hidden" }}>
                    <div style={{
                      width: `${progressPct}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #f97316, #ef4444)",
                      borderRadius: 6,
                      transition: "width 0.5s ease",
                      boxShadow: "0 0 8px #f9731666",
                    }} />
                  </div>
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading} style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}>
                {loading ? "⏳  Running Diagnosis..." : "⚡  Run Diagnosis"}
              </button>

              {alertMsg && (
                <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 10, border: `1px solid ${alertColor}`, background: `${alertColor}11`, fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "#e6edf3" }}>
                  <b style={{ fontSize: 13, letterSpacing: 1, color: alertColor }}>⚡ ALERT STATUS</b>
                  <div style={{ marginTop: 8 }}>{alertMsg}</div>
                </div>
              )}

              {report && (
                <div style={styles.reportCard}>
                  <div style={styles.reportHeader}>
                    <div style={styles.reportDot} />
                    <p style={styles.reportTitle}>Fault Diagnosis Report</p>
                    {reportId && <span style={styles.reportId}>{reportId}</span>}
                  </div>
                  <div style={styles.reportBody}>{report}</div>
                  <div style={{ padding: "0 24px 24px" }}>
                    <button onClick={() => handleDownload(report, `fault_report_${Date.now()}.txt`)} style={styles.downloadBtn}>⬇️ Download TXT</button>
                    {currentReportId && (
                      <button onClick={() => handleDownloadPDF(currentReportId)} style={styles.pdfBtn}>📄 Download PDF</button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === "history" && (
            <>
              {selectedReport ? (
                <>
                  <button style={styles.backBtn} onClick={() => setSelectedReport(null)}>← Back to History</button>
                  <div style={styles.reportCard}>
                    <div style={styles.reportHeader}>
                      <div style={styles.reportDot} />
                      <p style={styles.reportTitle}>Fault Diagnosis Report</p>
                      <span style={styles.reportId}>ID: {selectedReport.id}</span>
                    </div>
                    <div style={{ padding: "16px 24px 0", fontSize: 13, color: "#7d8590" }}>
                      <span>🕐 {new Date(selectedReport.timestamp).toLocaleString()}</span>
                      <span style={{ marginLeft: 20 }}>📝 {selectedReport.input}</span>
                      {selectedReport.language && (
                        <span style={{ marginLeft: 20 }}>🌐 {selectedReport.language}</span>
                      )}
                    </div>
                    <div style={styles.reportBody}>
                      {selectedReport.result?.report_agent || JSON.stringify(selectedReport.result, null, 2)}
                    </div>
                    {selectedReport.result?.alert_agent && (
                      <div style={{ margin: "0 24px 16px", padding: "12px 16px", borderRadius: 8, border: "1px solid #f97316", background: "#f9731611", fontSize: 13, color: "#e6edf3", whiteSpace: "pre-wrap" }}>
                        <b style={{ color: "#f97316" }}>⚡ ALERT: </b>{selectedReport.result.alert_agent}
                      </div>
                    )}
                    <div style={{ padding: "0 24px 24px" }}>
                      <button onClick={() => handleDownload(selectedReport.result?.report_agent || JSON.stringify(selectedReport.result, null, 2), `fault_report_${selectedReport.id}.txt`)} style={styles.downloadBtn}>⬇️ Download TXT</button>
                      <button onClick={() => handleDownloadPDF(selectedReport.id)} style={styles.pdfBtn}>📄 Download PDF</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 700 }}>Past Reports</h2>
                    <button onClick={fetchReports} style={styles.downloadBtn}>🔄 Refresh</button>
                  </div>
                  {historyLoading ? (
                    <div style={styles.emptyState}><span style={styles.spinner} /></div>
                  ) : reports.length === 0 ? (
                    <div style={styles.emptyState}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
                      No reports yet. Run a diagnosis first.
                    </div>
                  ) : (
                    reports.map((r) => (
                      <div
                        key={r.id}
                        style={{ ...styles.historyItem, ...(hoveredId === r.id ? styles.historyItemHover : {}) }}
                        onClick={() => fetchReportDetail(r.id)}
                        onMouseEnter={() => setHoveredId(r.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <span style={styles.historyId}>#{r.id}</span>
                        <span style={styles.historyInput}>{r.input}</span>
                        <span style={{ fontSize: 11, color: "#7d8590" }}>
                          {r.language === "telugu" ? "తెలుగు" : r.language === "hindi" ? "हिंदी" : "EN"}
                        </span>
                        <span style={styles.historyTime}>{new Date(r.timestamp).toLocaleString()}</span>
                        <span style={{ color: "#7d8590", fontSize: 18 }}>›</span>
                      </div>
                    ))
                  )}
                </>
              )}
            </>
          )}

          {tab === "stats" && (
            historyLoading
              ? <div style={styles.emptyState}><span style={styles.spinner} /></div>
              : <StatisticsTab reports={reports} />
          )}
        </main>
      </div>
    </>
  );
}