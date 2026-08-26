from agent1_orchestrator import app

result = app.invoke({
    "input": "Machine making grinding noise",
    "image_path": "C:/Users/ASUS/TeamMax/Sih project/test_machine.jpg",
    "context": {}
})

print(result["context"]["report_agent"])
