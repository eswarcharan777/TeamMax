from flask import Flask, request, jsonify
from flask_cors import CORS

from agent5_report import report_agent


app = Flask(__name__)
CORS(app)


@app.route("/generate-report", methods=["POST"])
def generate_report():

    data = request.get_json()

    issue = data.get("input", "Unknown issue")
    diagnosis = data.get(
        "diagnosis_agent",
        "No diagnosis available"
    )

    state = {
        "input": issue,
        "context": {
            "diagnosis_agent": diagnosis
        }
    }

    result = report_agent(state)

    return jsonify(result)


@app.route("/", methods=["GET"])
def home():
    return "Team MAX - Agent 5 Report Generation Agent is running."


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)