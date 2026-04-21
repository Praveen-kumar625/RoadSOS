# ADR 11: Hackathon Strategy

## Status
Accepted

## Context
Winning a hackathon requires balancing technical depth with a compelling, demonstrable story and clear societal impact.

## Decision: "The Golden Hour" Demonstration
1. **Vertical Slice:** Instead of building every possible service, we focused on the **Vertical Slice** of crash detection -> AI analysis -> hospital routing.
2. **Robust Mocks:** Integrated a high-fidelity Edge IoT simulator (`apps/edge-iot-firmware`) that can simulate realistic and "forced crash" scenarios.
3. **Advanced Artifacts:**
   - A dedicated **Prompt Analyzer CLI** to showcase developer-tooling maturity.
   - A data-science-ready **ML Proposal** for future city-wide expansion (Navotas case study).

## Consequences
- **Positive:** High clarity during the live demo; strong evidence of technical feasibility.
- **Negative:** Some secondary features (e.g., billing, user management) are mocked to prioritize the core safety loop.
