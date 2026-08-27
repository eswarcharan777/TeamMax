import { useState } from "react";

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
  agentRow: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  agentBadge: { background: "#21262d", border: "1px solid #30363d", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#7d8590", display: "flex", alignItems: "center", gap: 5 },
  spinner: { display: "inline-block", width: 16, height: 16, border: "2px solid #f9731633", borderTop: "2px solid #f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  downloadBtn: { marginTop: 12, padding: "10px 20px", background: "#21262d", border: "1px solid #30363d", borderRadius: 8, color: "#e6edf3", fontSize: 13, cursor: "pointer", fontWeight: 600 },
};

const AGENTS = ["vision", "document", "knowledge", "diagnosis", "alert", "report"];

export default function App() {
  const [image, setImage] = useState(null);
  const [input, setInput] = useState("");
  const [report, setReport] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState(-1);

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async () => {
    if (!input || !image) {
      alert("Please provide both image and description");
      return;
    }
    setLoading(true);
    setReport("");
    setAlertMsg("");
    setActiveAgent(0);

    try {
      const formData = new FormData();
      formData.append("file", image);
      const uploadRes = await fetch("http://localhost:8000/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      setActiveAgent(2);

      const response = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, image_path: uploadData.image_path }),
      });
      setActiveAgent(5);
      const data = await response.json();
      setReport(data.report_agent || JSON.stringify(data, null, 2));
      setAlertMsg(data.alert_agent || "");
    } catch (err) {
      setReport("Error: Could not connect to backend.");
    }

    setLoading(false);
    setActiveAgent(-1);
  };

  const handleDownload = () => {
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fault_report_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reportId = report.match(/FR-\d+/)?.[0] || "";
  const alertColor = alertMsg.includes("CRITICAL") ? "#ef4444" : alertMsg.includes("WARNING") ? "#f97316" : "#22c55e";

  return (
    <>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } @keyframes spin { to { transform: rotate(360deg); } } textarea:focus { border-color: #f97316 !important; }`}</style>
      <div style={styles.root}>
        <header style={styles.header}>
          <div style={styles.logo}>⚙️</div>
          <div>
            <p style={styles.headerTitle}>TeamMAX</p>
            <p style={styles.headerSub}>Industrial Fault Diagnosis System</p>
          </div>
          <span style={styles.badge}>SIH 2026</span>
        </header>

        <main style={styles.main}>
          <div style={styles.hero}>
            <span style={styles.heroTag}>AI-POWERED · 6 AGENTS</span>
            <h1 style={styles.heroTitle}>Diagnose Industrial Faults<br />in Seconds</h1>
            <p style={styles.heroSub}>Upload a machine image, describe the problem — get a full diagnostic report.</p>
          </div>

          <div style={styles.agentRow}>
            {AGENTS.map((a, i) => (
              <div key={a} style={{ ...styles.agentBadge, ...(activeAgent >= i ? { borderColor: "#f97316", color: "#f97316", background: "#f9731611" } : {}) }}>
                {activeAgent === i ? <span style={styles.spinner} /> : "●"} {a}_agent
              </div>
            ))}
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>📷 Machine Image</div>
            <div style={{ ...styles.uploadArea, ...(image ? styles.uploadAreaActive : {}) }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
              {!image ? (
                <>
                  <div style={styles.uploadIcon}>🖼️</div>
                  <p style={styles.uploadText}>Click to upload machine image<br /><span style={{ fontSize: 12 }}>JPG, PNG supported</span></p>
                </>
              ) : (
                <div style={styles.uploadSelected}>
                  <span>📎</span>
                  <span style={{ color: "#58a6ff", fontSize: 14 }}>{image.name}</span>
                  <span style={{ marginLeft: "auto", color: "#7d8590", fontSize: 12 }}>{(image.size / 1024).toFixed(0)} KB</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>📝 Problem Description</div>
            <textarea rows={4} style={styles.textarea} placeholder="e.g. Bearing making unusual grinding noise, possible overheating since last shift..." value={input} onChange={(e) => setInput(e.target.value)} />
          </div>

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
                <button onClick={handleDownload} style={styles.downloadBtn}>⬇️ Download Report</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}