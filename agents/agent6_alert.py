def alert_agent(state: dict) -> dict:
    diagnosis = state.get("context", {}).get("diagnosis_agent", "")
    
    severity = "Low"
    if "high" in diagnosis.lower():
        severity = "High"
    elif "medium" in diagnosis.lower() or "moderate" in diagnosis.lower():
        severity = "Medium"

    if severity == "High":
        alert = (
            "🚨 CRITICAL ALERT — Immediate action required!\n"
            "Severity: HIGH\n"
            "Action: Shut down equipment and notify maintenance supervisor immediately.\n"
            "Escalation: Site manager must be informed within 30 minutes."
        )
    elif severity == "Medium":
        alert = (
            "⚠️ WARNING — Schedule maintenance soon.\n"
            "Severity: MEDIUM\n"
            "Action: Monitor equipment closely. Plan maintenance within 24 hours."
        )
    else:
        alert = (
            "✅ LOW SEVERITY — No immediate action needed.\n"
            "Severity: LOW\n"
            "Action: Log the issue and review during next scheduled maintenance."
        )

    state["context"]["alert_agent"] = alert
    return state