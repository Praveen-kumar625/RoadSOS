# <p align="center">🚨 Road<span style="color:#EF4444">SOS</span></p>
<p align="center"><b>Edge-First Emergency Response System</b><br/><i>Designed for Infrastructure Failure • Built for Life-Critical Resilience</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/Architecture-FSD-blue?style=for-the-badge" alt="FSD Architecture" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Zero--Trust-Security-red?style=for-the-badge" alt="Zero-Trust" />
</p>

---

## ⚡ Overview
**RoadSoS** is a safety-critical distributed system engineered to solve the "last-mile" failure of emergency services. While traditional systems rely on stable cloud connections and manual triggers, RoadSoS operates on an **Edge-First** philosophy—detecting physical impacts locally on-device and orchestrating deterministic dispatch even when the network is partitioned.

> **"RoadSOS is not built for systems that work—it is built for systems that fail and still respond."**

---

## ✨ High-Fidelity Experience (Dark Neon)
The web client features a **Zero-Cognitive-Load** interface designed for high-stress scenarios:

*   🔴 **Primary/Emergency:** Neon Red (#EF4444) with pulsating glow effects for SOS actions.
*   🔵 **Tracking:** Electric Blue (#3B82F6) for active routes and responder telemetry.
*   🔲 **Glassmorphism:** Subtle transparent cards with backdrop blurs for depth and focus.
*   📱 **Mobile-First:** Optimized for one-thumb reachability (Bottom-heavy action centers).

---

## 🛠️ Core Engineering Pillars

### 1. Edge-First Detection
High-frequency IMU sampling fused with resultant acceleration and rotational inertia algorithms. Physical impact analysis is handled **locally** at 100Hz to eliminate cloud latency.

### 2. Deterministic Dispatch
Uses **H3 Spatial Indexing** and real-time heartbeat-based liveness verification. If a responder doesn't pulse, they are evicted—ensuring every dispatch is backed by a verified unit.

### 3. Event-Driven Resilience
Built on **Redis Streams** for durable event logging. The system treats a "missing signal" as an actionable data event, triggering immediate auto-failover to backup units.

---

## 📂 Project Structure (FSD)
This monorepo follows the **Feature-Sliced Design** architecture for modularity and scalability:

```text
roadsos/
├── apps/
│   ├── web-client-roadsos/      # Next.js 15 App (UI/UX)
│   ├── api-gateway-service/     # Ingestion & Socket Orchestration
│   └── edge-iot-firmware/       # Hardware Simulation & Logic
├── libs/
│   ├── ai-local-models/         # RAG & Triage Logic
│   └── core-types/              # Shared Domain Types
└── tools/                       # Security Audits & SAST
```

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** >= 20.0.0
- **npm** >= 10.x

### 🔧 Setup Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Shubhamsaboo/awesome-llm-apps.git
   cd roadsos
   ```

2. **Install Dependencies**
   ```bash
   # From the root directory
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp apps/web-client-roadsos/.env.local.example apps/web-client-roadsos/.env.local
   ```

4. **Launch Development Environment**
   ```bash
   # To start only the Web Client (Recommended for UI Preview)
   cd apps/web-client-roadsos
   npm run dev
   ```

5. **Access the Preview**
   - Open **[http://localhost:3000](http://localhost:3000)**
   - **Tip:** Press `F12` and toggle **Mobile View** to see the optimized emergency interface.

---

## 🛡️ Failure Model & Resilience

| Scenario | Detection | System Response |
| :--- | :--- | :--- |
| **Network Loss** | Uplink ACK Timeout | Local NVS buffering & delayed sync |
| **Responder Silent** | Heartbeat TTL Expiry | Immediate re-dispatch to next closest |
| **Process Crash** | OS Signal | State hydration from Redis Streams |
| **Routing Failure** | API 404/Timeout | Euclidean + Urban Heuristic fallback |

---

## 👤 Team: Divine Coder
- **Team Lead:** Praveen Kumar
- **Hackathon:** National Road Safety Hackathon 2026 (IIT Madras)

---

<p align="center">
  <b>Built with ❤️ for Road Safety</b>
</p>
