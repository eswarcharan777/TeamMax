import chromadb

client = chromadb.PersistentClient(path="./fault_db")
collection = client.get_or_create_collection(name="fault_history")

cases = [
    ("seed_001", "Input: bearing grinding noise | Diagnosis: Bearing wear due to insufficient lubrication, High severity. Replace bearing immediately."),
    ("seed_002", "Input: motor overheating | Diagnosis: Motor winding failure due to overload, High severity. Shut down and inspect windings."),
    ("seed_003", "Input: conveyor belt slipping | Diagnosis: Belt tension loss, Medium severity. Adjust tension and check for wear."),
    ("seed_004", "Input: pump vibration unusual | Diagnosis: Cavitation in pump, Medium severity. Check inlet pressure and flow rate."),
    ("seed_005", "Input: gearbox loud noise | Diagnosis: Gear tooth damage, High severity. Drain oil, inspect gears, replace damaged parts."),
    ("seed_006", "Input: hydraulic system pressure drop | Diagnosis: Hydraulic seal failure, Medium severity. Replace seals and check fluid level."),
    ("seed_007", "Input: electrical panel sparking | Diagnosis: Loose connection or short circuit, Critical severity. Isolate power immediately."),
    ("seed_008", "Input: compressor not building pressure | Diagnosis: Valve failure in compressor, Medium severity. Inspect and replace valves."),
    ("seed_009", "Input: fan blade cracked | Diagnosis: Metal fatigue in fan blade, High severity. Replace fan assembly immediately."),
    ("seed_010", "Input: coolant leak machine | Diagnosis: Coolant hose failure, Low severity. Replace hose and refill coolant."),
    ("seed_011", "Input: spindle vibration cnc machine | Diagnosis: Spindle bearing damage, High severity. Replace spindle bearing."),
    ("seed_012", "Input: smoke from motor | Diagnosis: Motor insulation burnout, Critical severity. Shut down immediately, replace motor."),
    ("seed_013", "Input: belt conveyor misalignment | Diagnosis: Conveyor frame misalignment, Low severity. Realign frame and idlers."),
    ("seed_014", "Input: robotic arm jerky movement | Diagnosis: Servo motor encoder fault, Medium severity. Recalibrate or replace encoder."),
    ("seed_015", "Input: boiler pressure high | Diagnosis: Pressure relief valve stuck, Critical severity. Emergency shutdown required."),
]

# Clear old seeded data if re-running
existing = collection.get()
if existing["ids"]:
    seed_ids = [id for id in existing["ids"] if id.startswith("seed_")]
    if seed_ids:
        collection.delete(ids=seed_ids)

collection.add(
    documents=[c[1] for c in cases],
    ids=[c[0] for c in cases]
)

print(f"✅ Seeded {len(cases)} fault cases into knowledge base.")