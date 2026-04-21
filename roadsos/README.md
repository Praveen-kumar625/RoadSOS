# RoadSoS: Deterministic Emergency Orchestration
**Divine Coders | IIT Madras Hackathon 2026**

RoadSoS is a prototype emergency response system designed to reduce response times through deterministic dispatch logic, geospatial analysis, and multi-responder coordination.

## 🛠 Project Objectives
The goal of this prototype is to demonstrate a reliable pipeline from incident detection to responder dispatch. Unlike standard reporting apps, RoadSoS focuses on the **orchestration** of multiple services (Hospitals, Police, Towing) based on real-world constraints.

## 🚀 Key Features
- **Deterministic Dispatch:** Replaced random logic with a scoring system based on the Haversine formula (distance), responder availability, and incident severity.
- **Geospatial Intelligence:** Primary lookups utilize a verified local dataset of responders around the IIT Madras area, with a dynamic fallback to the OpenStreetMap Overpass API.
- **Hybrid AI Pipeline:** Uses a rule-based physics engine (G-force thresholds) as the primary detection logic, augmented by LLM analysis (Qwen 2.5) for confirmation and nuance.
- **Observability:** Real-time monitoring of system health, M2M latency, and telemetry ingestion.

## 🏗 System Architecture
The system follows a linear, predictable flow:
1.  **Edge Ingestion:** Receives telemetry (accelerometer, speed) from IoT devices.
2.  **Detection Engine:** 
    - **Rules:** Immediate crash detection based on G-force impact (>12G).
    - **AI:** Secondary validation using HuggingFace Inference (Qwen 2.5-7B).
3.  **Spatial Indexing:** Identifies the closest available responders using Haversine distance.
4.  **Emergency Orchestration:** Scores and selects the optimal "Response Team" (Hospital, Police, Towing) using the Emergency Scoring System (ESS).
5.  **Dispatch:** Emits orchestration events to responders and tracking dashboards.

## 📦 Tech Stack
- **Backend:** Node.js (Express), Socket.io (Real-time updates)
- **Frontend:** Next.js (React), Tailwind CSS, Recharts
- **AI:** HuggingFace Inference SDK (@huggingface/inference)
- **Geospatial:** Haversine Algorithm, Overpass API (OSM)
- **Tooling:** Turbo (Monorepo), Jest (Testing)

## 🚦 Quick Start
```bash
# Install dependencies
npm install

# Start the ecosystem
npm run dev
```

## 🧪 Validation
This prototype includes an integration test suite to verify the deterministic nature of the dispatch algorithm.
```bash
cd apps/api-gateway-service
npm test
```

## 👥 Team
**Praveen Kumar** (Lead Architect) & Team **Divine Coders**
