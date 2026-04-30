# RoadSoS
### Edge-First Emergency Response System
#### Designed for Infrastructure Failure

---

> **System Type:** Safety-Critical Distributed System  
> **Core Metric:** Time-to-First-Response  
> **Architecture:** Edge-First, Event-Driven, Zero-Trust  
> **Status:** Prototype (Production-Oriented Design)

---

## 1. Problem Statement

Existing emergency response systems frequently fail in critical life-safety scenarios due to:

*   **User Incapacitation:** Unconscious victims are unable to trigger manual SOS alerts.
*   **Network Latency/Loss:** Cloud-dependent detection (e.g., LLM inference) introduces unacceptable delays or total failure in rural and high-impact zones.
*   **Operational Noise:** High false-positive rates (potholes, dropped phones) saturate emergency services, while "ghost" responders (offline units) create dispatch bottlenecks.

---

## 2. System Philosophy

RoadSoS is built on four core engineering pillars:

*   **Design for failure, not success:** Every component assumes the network is partitioned, the responder is silent, and the process will restart.
*   **Detection must never block:** Physical impact analysis is handled locally on-device at 100Hz; networking is treated as an asynchronous background concern.
*   **Dispatch must be deterministic:** Responder selection is based on verifiable real-time liveness and road-network geometry, eliminating statistical guesswork.
*   **Absence of signal is a signal:** A missing heartbeat from an assigned responder is treated as an actionable data event, triggering immediate failover.

---

## 3. Architecture Overview

The system utilizes a multi-layered mesh to isolate failures and ensure high availability:

| Layer | Responsibility |
| :--- | :--- |
| **Edge Layer** | High-frequency IMU sampling, Resultant Acceleration, and Rotational Inertia fusion. |
| **Ingestion Layer** | Asynchronous gateway utilizing an internal Event Bus to decouple alerts from logic. |
| **Orchestrator** | Incident state management, H3 spatial indexing, and Emergency Scoring (ESS). |
| **Response Layer** | Duplex communication for responders with adaptive heartbeats and liveness tracking. |
| **Security Layer** | Zero-Trust enforcement with JWT handshakes and monotonic sequence validation. |

---

## 4. Data Flow

1.  **Detection:** Edge device detects $a_{res} > T_g$ fused with rotational energy $\omega_{res}$.
2.  **Emission:** Event-triggered uplink sends a signed, sequenced packet to the Ingestion Layer.
3.  **Dispatch:** Orchestrator shortlists the closest **Liveness-Verified** responders via H3 cell expansion.
4.  **Handshake:** Selected responder accepts the incident via a private, authenticated Socket Room.
5.  **Tracking:** Dynamic ETA monitoring initiates parallel dispatch if the primary responder deviates or goes silent.

---

## 5. Core Engineering Features

*   **Asynchronous Edge Pipeline:** Sampling runs in a simulated ISR; networking is offloaded to a producer-consumer queue with exponential backoff.
*   **Event-Driven Anomaly Detection:** No polling watchdogs. Re-dispatch is triggered reactively by GPS deltas or missed heartbeat events.
*   **Heartbeat-based Liveness:** Responders maintain an active TTL. Units without recent pings are evicted from the primary dispatch index.
*   **Replay Protection:** Telemetry payloads utilize a monotonic sequence counter to prevent adversarial re-injection.
*   **State Hydration:** Non-blocking filesystem hooks ensure city-wide emergency state is persisted and recoverable after a crash.

---

## 6. Failure Model

| Failure Scenario | Detection Mechanism | System Response | Degradation Strategy |
| :--- | :--- | :--- | :--- |
| **Network Loss** | Uplink ACK timeout | Local buffering in NVS | Delayed sync via SMS/Fallback |
| **Responder Silent** | Heartbeat TTL expiry | Emit `RESPONDER_SILENT` | Auto-failover to backup unit |
| **Process Crash** | OS signal | `hydrate()` hook on boot | Restore state from distributed Redis Streams |
| **Routing Failure** | API Timeout/404 | Tier-1 Heuristic Fallback | Dispatch via Euclidean + Urban Heuristic |
| **Security Breach** | Invalid JWT / Replay | Socket Disconnection | Immediate unauthorized access block |

---

## 7. Security Model

*   **Handshake Authentication:** All socket connections require a JWT verified against an HMAC secret.
*   **Scoped Communication:** Real-time data is restricted to `incident_${id}` rooms; zero city-wide broadcasting.
*   **Replay Prevention:** Hardened validation of monotonic sequence numbers for all edge telemetry.
*   **Known Constraint:** In this prototype, secrets are managed via environment variables rather than a production-grade Vault.

---

## 8. Implementation Gaps & Transparency

For the purpose of evaluation, the following production components are currently simulated or simplified:

*   **H3-Lite:** A grid-based spatial hash is used instead of the full hierarchical hexagonal Uber H3 library.
*   **Transport Simulation:** The edge simulator utilizes HTTP POST over TCP to mimic the intended MQTT-SN over UDP protocol.
*   **Partial Persistence:** State is persisted to a local JSON flat-file rather than a distributed Redis/Kafka cluster.

---

## 9. Production Upgrade Path

*   **Spatial:** Replace Grid-Hash with official **H3 Hierarchical Indexing** to eliminate boundary artifacts.
*   **Durability:** Transition from filesystem hooks to **Redis Streams** or **Kafka** for event-sourced persistence.
*   **Protocol:** Implement a true **MQTT-SN Gateway** for low-overhead UDP edge alerts.
*   **Security:** Integrate **HashiCorp Vault** for secret rotation and mTLS for device-to-gateway identity.

---

## 10. Demo Flow

1.  **Trigger:** Execute IoT simulator with `--crash`.
2.  **Detection:** Review firmware logs for local physics validation (Resultant-A + Rotation).
3.  **Liveness:** Observe the dashboard excluding OFFLINE/STALE responders in real-time.
4.  **Handshake:** Verify secure dispatch to an ACTIVE responder and JWT tracking link generation.
5.  **Resilience:** Simulate responder signal loss and observe the event-driven re-dispatch in <1s.

---

## 11. Final Defensive Statement

RoadSoS is not claiming perfection—we are demonstrating a system that knows its failure modes and is designed to evolve beyond them. While individual implementation details have been simplified for this prototype, the underlying architecture is built to sustain life-saving operations under extreme infrastructure failure.

**RoadSOS is not built for systems that work—it is built for systems that fail and still respond.**
