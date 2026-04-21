# ADR 01: System Blueprint

## Status
Accepted

## Context
RoadSoS requires a low-latency, resilient architecture capable of handling real-time telemetry from IoT edge devices and performing AI-driven crash validation.

## Decision: Three-Tier Decoupled Architecture
We are adopting a decoupled architecture consisting of three primary layers:

1. **Edge Layer (ESP32/IoT):**
   - Responsibilities: High-frequency sampling, local signal filtering, and offline buffering.
   - Technology: C++/JavaScript (Simulated).

2. **Connectivity Layer (API Gateway):**
   - Responsibilities: Telemetry ingestion, real-time broadcasting (Socket.io), and AI orchestration.
   - Technology: Node.js (Express).

3. **Intelligent Hub (Aegis-Core AI):**
   - Responsibilities: Natural language crash severity analysis.
   - Technology: Qwen 2.5 via HuggingFace API.

## Consequences
- **Positive:** Modular services allow for independent scaling. Edge AI reduces cloud compute costs.
- **Negative:** Increased complexity in local networking and synchronization.
