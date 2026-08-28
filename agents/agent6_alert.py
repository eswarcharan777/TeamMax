ALERT_TEMPLATES = {
    "english": {
        "high": (
            "🚨 CRITICAL ALERT — Immediate action required!\n"
            "Severity: HIGH\n"
            "Action: Shut down equipment and notify maintenance supervisor immediately.\n"
            "Escalation: Site manager must be informed within 30 minutes."
        ),
        "medium": (
            "⚠️ WARNING — Schedule maintenance soon.\n"
            "Severity: MEDIUM\n"
            "Action: Monitor equipment closely. Plan maintenance within 24 hours."
        ),
        "low": (
            "✅ LOW SEVERITY — No immediate action needed.\n"
            "Severity: LOW\n"
            "Action: Log the issue and review during next scheduled maintenance."
        ),
    },
    "telugu": {
        "high": (
            "🚨 క్రిటికల్ అలెర్ట్ — వెంటనే చర్య అవసరం!\n"
            "తీవ్రత: అధికం\n"
            "చర్య: పరికరాన్ని వెంటనే ఆపి, నిర్వహణ సూపర్వైజర్‌కు తెలియజేయండి.\n"
            "ఎస్కలేషన్: సైట్ మేనేజర్‌కు 30 నిమిషాల్లో తెలియజేయాలి."
        ),
        "medium": (
            "⚠️ హెచ్చరిక — త్వరలో నిర్వహణ చేయండి.\n"
            "తీవ్రత: మధ్యస్థం\n"
            "చర్య: పరికరాన్ని నిశితంగా పర్యవేక్షించండి. 24 గంటల్లో నిర్వహణ చేయండి."
        ),
        "low": (
            "✅ తక్కువ తీవ్రత — వెంటనే చర్య అవసరం లేదు.\n"
            "తీవ్రత: తక్కువ\n"
            "చర్య: సమస్యను నమోదు చేసి, తదుపరి షెడ్యూల్డ్ నిర్వహణలో సమీక్షించండి."
        ),
    },
    "hindi": {
        "high": (
            "🚨 गंभीर चेतावनी — तत्काल कार्रवाई आवश्यक!\n"
            "गंभीरता: उच्च\n"
            "कार्रवाई: उपकरण तुरंत बंद करें और रखरखाव पर्यवेक्षक को सूचित करें।\n"
            "एस्केलेशन: साइट मैनेजर को 30 मिनट के भीतर सूचित किया जाना चाहिए।"
        ),
        "medium": (
            "⚠️ चेतावनी — जल्द रखरखाव करें।\n"
            "गंभीरता: मध्यम\n"
            "कार्रवाई: उपकरण पर नज़र रखें। 24 घंटों के भीतर रखरखाव की योजना बनाएं।"
        ),
        "low": (
            "✅ कम गंभीरता — तत्काल कार्रवाई की आवश्यकता नहीं।\n"
            "गंभीरता: कम\n"
            "कार्रवाई: समस्या दर्ज करें और अगले निर्धारित रखरखाव में समीक्षा करें।"
        ),
    },
}

def alert_agent(state: dict) -> dict:
    diagnosis = state.get("context", {}).get("diagnosis_agent", "")
    language = state.get("language", "english")
    templates = ALERT_TEMPLATES.get(language, ALERT_TEMPLATES["english"])

    severity = "low"
    if "high" in diagnosis.lower():
        severity = "high"
    elif "medium" in diagnosis.lower() or "moderate" in diagnosis.lower():
        severity = "medium"

    alert = templates[severity]
    state["context"]["alert_agent"] = alert
    return state