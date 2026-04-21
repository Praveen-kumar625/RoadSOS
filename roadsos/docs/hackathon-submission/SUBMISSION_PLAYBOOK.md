# RoadSoS: 7-Day Winning Execution Plan
**IIT Madras COERS Hackathon 2026**

This document outlines the final-mile execution strategy to maximize your odds of winning by directly mapping features to the judging criteria.

---

## 🏆 Scoring Rubric Alignment
| Criterion | RoadSoS Evidence |
| :--- | :--- |
| **Innovation (25%)** | Multi-Agent AI Orchestration, Duplicate Detection Engine, ESS Algorithm. |
| **Complexity (25%)** | Monorepo Architecture, Real-time WebSockets, FSD Structure, Zod Validation. |
| **Impact (20%)** | Saving the "Golden Hour", Dynamic Resource Discovery via OSM. |
| **Feasibility (15%)** | Dockerized deployment, Open-source tools, Privacy/Ethics compliance. |
| **Presentation (15%)** | 7-Slide PERSUASIVE narrative, AI Explanation Panel. |

---

## 📅 Final 7-Day Countdown

### Day 7-6: Technical Polish & Edge Cases
- [ ] **Verify Ingestion:** Run `npm run crash` and ensure the dashboard updates in <500ms.
- [ ] **Test Duplicate Detection:** Trigger two crashes at the same coordinate and verify the "Merged" event log in the terminal.
- [ ] **PWA Audit:** Ensure the web client can be "Added to Home Screen" for offline reporting simulation.

### Day 5-4: Documentation & "God-Level" README
- [ ] **Final Architecture Diagram:** Use the Mermaid diagram in `ADR 01` for your technical report.
- [ ] **Video Demo Script:** Record a 3-minute video. 
  - 0:00-0:30: The Pain (Manual reporting is slow).
  - 0:30-2:00: The Hero Path (Auto-detection -> AI Analysis -> Multi-responder dispatch).
  - 2:00-3:00: The "Why Us" (Scalability, AI Reasoning, Global OSM usage).

### Day 3: Security & Ethics
- [ ] **Run SAST:** `npm run security-audit` and screenshot the "PASSED" result for your report.
- [ ] **Privacy Check:** Ensure the `PrivacyConsent` component is visible and explain data anonymization during the Q&A.

### Day 2: The Pitch Deck
- [ ] **Follow `PRESENTATION_OUTLINE.md`:** Ensure Slide 4 (OSM) and Slide 5 (ESS Score) are highlighted—they are your biggest technical differentiators.

### Day 1: Submission Finalization
- [ ] **Generate Submission Doc:** Run `npm run generate-doc` to get the consolidated 30+ page code documentation.
- [ ] **Final Build:** `docker-compose up --build` one last time to ensure zero runtime errors.

---

## 💡 Pro-Tip for Q&A (Be Ready)
**Question:** "How do you handle privacy of the accident victims?"
**Answer:** "RoadSoS utilizes a **Data Minimization** strategy. We only capture telemetry and location during a verified G-force trigger. All data is end-to-end encrypted and shared only with mandated first responders. Post-incident, data is anonymized for city-level road safety heatmaps."
