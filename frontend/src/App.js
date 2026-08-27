import { useState } from "react";

function App() {
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [input, setInput] = useState("");
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    if (!input || !image) {
      alert("Please provide both image and description");
      return;
    }
    setLoading(true);
    setReport("");
    try {
      // Step 1: Upload image
      const formData = new FormData();
      formData.append("file", image);
      const uploadRes = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      const serverImagePath = uploadData.image_path;

      // Step 2: Run pipeline with server path
      const response = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input, image_path: serverImagePath }),
      });
      const data = await response.json();
      setReport(data.report_agent || JSON.stringify(data));
    } catch (err) {
      setReport("Error: Could not connect to backend.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial", padding: 20 }}>
      <h1 style={{ color: "#1a1a2e" }}>TeamMax - Industrial Fault Diagnosis</h1>
      <hr />
      <div style={{ marginBottom: 20 }}>
        <label><b>Upload Machine Image:</b></label><br />
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: 8 }} />
        {image && <p style={{ color: "green" }}>Selected: {image.name}</p>}
      </div>
      <div style={{ marginBottom: 20 }}>
        <label><b>Describe the Problem:</b></label><br />
        <textarea
          rows={4}
          style={{ width: "100%", marginTop: 8, padding: 10, fontSize: 14 }}
          placeholder="e.g. Machine making grinding noise..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ background: "#1a1a2e", color: "white", padding: "12px 30px", fontSize: 16, border: "none", borderRadius: 6, cursor: "pointer" }}
      >
        {loading ? "Analysing..." : "Run Diagnosis"}
      </button>
      {report && (
        <div style={{ marginTop: 30, background: "#f4f4f4", padding: 20, borderRadius: 8 }}>
          <h2>Fault Report</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>{report}</pre>
        </div>
      )}
    </div>
  );
}

export default App;