# RoadSoS: Winning-Level Presentation Outline (7 Slides)

## Team: Divine Coders (IIT Madras 2026)
**Core Narrative:** From simple SOS apps to AI-powered Infrastructure.

---

### Slide 1: Welcome
**Visuals:** Team Logo, RoadSoS Logo, Banner: "The Future of Emergency Infrastructure."
**Script:** 
"Good morning, judges. We are Team Divine Coders. Most emergency apps today are simple 'call-for-help' buttons. Today, we present **RoadSoS Orchestrator**: a production-grade AI engine that doesn't just call for help—it coordinates a multi-agent rescue mission in real-time."

---

### Slide 2: The Problem: The Reporting Gap
**Visuals:** Map of India with "Dead Zones" highlighted. Key stat: "Delayed reporting increases fatality rates by 60%."
**Script:** 
"The Golden Hour is lost not because help isn't available, but because reporting is manual and resource allocation is unoptimized. We solve this by bridging the Edge IoT data gap with intelligent cloud orchestration."

---

### Slide 3: Resilience: Offline-First Edge IoT
**Visuals:** Diagram of the 'Circular Offline Buffer'. ESP32 code snippet showing 0ms detection lag.
**Script:** 
"Our ESP32 firmware features a **Circular Offline Buffer**. In areas with zero connectivity, the sensor continues to sample at 100Hz, stores the crash signature locally, and automatically synchronizes with the gateway the second a signal is found. No data point is ever lost."

---

### Slide 4: Intelligence: The Aegis-Core ESS
**Visuals:** The Scoring Formula: `Score = (Severity * 0.5) + (Traffic * 0.2) + (Proximity * 0.3)`. 
**Script:** 
"This is our game-changer: The **Emergency Scoring System (ESS)**. Instead of just picking the 'nearest' hospital, Aegis-Core analyzes live traffic, vehicle type compatibility, and crash severity to pick the **best** responder team. It coordinates Police, Ambulances, and Towing services as a single, unified unit."

---

### Slide 5: The Orchestrator Hub (Demo Intro)
**Visuals:** Screenshot of the Dashboard with the **AI Decision Logic** panel. 
**Script:** 
"Transparency builds trust. Our system provides dispatchers with an **AI Explanation Panel**, detailing exactly why a specific team was chosen—balancing speed against traffic congestion and hospital capacity. This is scalable emergency infrastructure in action."

---

### Slide 6: Demonstration (2 Minutes)
**Visuals:** LIVE DEMO of the Orchestrator. 
**Steps:**
1. Trigger 'Forced Crash' via CLI.
2. Show Waveform spike on Dashboard.
3. Show status transition: `ANALYZING` -> `DISPATCHED`.
4. Point out the **Priority Score** and **Multi-Agent coordinated list**.
**Script:** 
"Watch as a 14G impact is detected. The system doesn't hesitate. It fetches OSM data, runs the ESS algorithm, and dispatches a full rescue team within 500ms. Note the scoring factors—this is system intelligence, not just a service app."

---

### Slide 7: Thank You & Scalability
**Visuals:** Architecture Recap. Team QR Code. "Divine Coders: Engineering for Life."
**Script:** 
"RoadSoS is built as a modular monorepo, ready for city-wide Docker deployment. We are ready to turn India’s roads from dangerous paths into protected networks. Thank you."
