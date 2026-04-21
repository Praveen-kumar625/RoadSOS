# RoadSoS Pro: AI-Powered Emergency Infrastructure
**Divine Coders | IIT Madras Hackathon 2026**

![Status](https://img.shields.io/badge/Status-100%25_Solid_Submission-brightgreen)
![Tech](https://img.shields.io/badge/Stack-Next.js_15--Node.js--Turbo-blue)

RoadSoS Pro is a production-grade emergency orchestration system designed to eliminate reporting delays and optimize rescue operations using Edge AI and real-time spatial data.

## 🚀 Key Differentiators (Judge's Guide)
1.  **Orchestration vs. Reporting:** Unlike basic SOS apps, RoadSoS uses an **Emergency Scoring System (ESS)** to coordinate multiple responders (Police, Hospital, Towing) as a single unit.
2.  **Observability-First:** Real-time system health monitoring, including **M2M Latency tracking** and infrastructure load visualization.
3.  **Edge Resilience:** An **Offline-First Circular Buffer** on the ESP32 ensures zero data loss in rural connectivity "dead zones."
4.  **Aegis-Core AI:** Hybrid inferencing (Qwen 2.5) with **Circuit Breaker Fallbacks** for reliable crash severity validation.

## 🛠 Engineering Excellence
- **Monorepo Architecture:** Powered by **Turbo & NX** for high-speed builds and shared library caching.
- **Shared Intelligence:** Centralized logic in `libs/ai-local-models` and `libs/core-types` (Zod schemas).
- **OWASP Hardened:** Built-in SAST security scanning and rate limiting.

## 📦 Quick Execution
```bash
# Start the entire ecosystem
./scripts/docker/local-up.sh
```

## 📄 Submission Artifacts
- **Technical Report:** `RoadSoS_Submission_Final.docx` (Generated programmatically)
- **Presentation:** 7-Slide Strategic Pitch in `docs/hackathon-submission/PRESENTATION_OUTLINE.md`
- **Simulation Playbook:** Step-by-step judge's walkthrough in `SUBMISSION_PLAYBOOK.md`

## 👥 Team
**Praveen Kumar** (Lead Architect) & Team **Divine Coders**
