import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier

# Team Name: Divine coder
# Project: RoadSoS (IIT Madras Hackathon)

def train():
    # Synthetic dataset based on MoRTH accident patterns
    # Features: speed_kmh, impact_g, vehicle_type (0:Two, 1:Four, 2:Heavy), hour_of_day
    data = {
        'speed_kmh': [110, 20, 60, 80, 10, 120, 40, 100, 15, 75, 95, 30],
        'impact_g': [25.5, 2.1, 8.4, 15.2, 1.5, 30.0, 5.0, 22.1, 1.8, 12.5, 18.2, 3.2],
        'vehicle_type': [1, 0, 1, 2, 0, 1, 2, 1, 0, 1, 1, 0],
        'hour_of_day': [2, 14, 18, 23, 10, 1, 8, 3, 12, 19, 4, 16],
        'severity': [2, 0, 1, 2, 0, 2, 1, 2, 0, 1, 2, 0] # 0:LOW, 1:MODERATE, 2:CRITICAL
    }

    df = pd.DataFrame(data)
    X = df.drop('severity', axis=1)
    y = df['severity']

    # Train Random Forest Classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Export model for FastAPI serving
    joblib.dump(model, 'model.joblib')
    print("[AI-TRAIN] Success: model.joblib generated using RandomForest.")

if __name__ == "__main__":
    train()
