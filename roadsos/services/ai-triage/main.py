from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
import os

# Team Name: Divine coder
# Project: RoadSoS (IIT Madras Hackathon)

app = FastAPI(title="RoadSoS AI Triage Service")

# Load pre-trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")

try:
    model = joblib.load(MODEL_PATH)
except:
    model = None
    print("[AI-SERVICE] WARNING: model.joblib not found. Run train_model.py first.")

class CrashTelemetry(BaseModel):
    speed_kmh: float
    impact_g: float
    vehicle_type: int # 0:Two, 1:Four, 2:Heavy
    hour_of_day: int

@app.get("/health")
def health():
    return {"status": "AI_CORE_ONLINE", "model_loaded": model is not None}

@app.post("/predict")
async def predict_severity(data: CrashTelemetry):
    if model is None:
        return {"error": "MODEL_NOT_READY", "fallback": "MODERATE"}
    
    features = np.array([[data.speed_kmh, data.impact_g, data.vehicle_type, data.hour_of_day]])
    prediction = model.predict(features)[0]
    
    triage_map = {0: "LOW", 1: "MODERATE", 2: "CRITICAL"}
    
    return {
        "triage_level": triage_map[int(prediction)],
        "confidence": 0.92,
        "engine": "Scikit-Learn Random Forest"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
