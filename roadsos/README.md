# RoadSoS: Near-Instant Accident Response System
**Divine Coders | IIT Madras Hackathon 2026**

![RoadSoS Banner](https://img.shields.io/badge/Status-Hackathon--MVP-brightgreen)
![License](https://img.shields.io/badge/License-Apache%202.0-blue)

RoadSoS is an integrated IoT and AI ecosystem designed to eliminate reporting delays and optimize emergency response within the "Golden Hour" of a road accident.

## 🚀 Vision
To reduce road accident fatalities in India by 80% through automated impact detection and precision triage using Aegis-Core AI.

## 🛠 Features
- **Auto-Crash Detection:** Real-time IMU telemetry analysis for high G-force events.
- **Aegis-Core AI:** Local/Hybrid inferencing using Qwen 2.5 to validate crashes and assess severity.
- **Dynamic Hospital Routing:** Real-time spatial discovery of trauma centers via OpenStreetMap.
- **Resilient Edge:** Offline buffering for data persistence during network outages.
- **Live Monitoring:** Interactive dispatcher dashboard with impact waveforms.

## 📦 Setup & Execution

### Prerequisites
- Node.js >= 20.0.0
- Docker & Docker Compose
- [Bun](https://bun.sh) (for CLI tools)

### Quick Start
```bash
# Clone and enter directory
cd roadsos

# Install and build
npm install
npm run build

# Start the full stack
docker-compose up --build
```

### Prompt Analyzer CLI
A production-ready tool to help developers build better AI prompts.
```bash
cd apps/prompt-analyzer-cli
bun start tests/sample-prompt.txt
```

## 📄 Documentation
- [Executive Summary](./docs/hackathon-submission/executive-summary.md)
- [Technical Feasibility](./docs/hackathon-submission/technical-feasibility.md)
- [ML Project Proposal](./docs/hackathon-submission/cchain-ml-proposal.md)

## 🛡 Security
- Built-in OWASP hardening.
- Custom SAST scanner (`npm run security-audit`).
- Automated prompt injection defense evaluations.

## 👥 Team
- **Praveen Kumar** (Team Lead / Architect)
- **Divine Coders**
