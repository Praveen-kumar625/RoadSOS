# ADR 01: System Blueprint & Event Flow

## Status: Accepted (Upgraded to Production-Grade)

## Context
Initial review identified a lack of clear event flow and resilience. This ADR now defines the robust, event-driven architecture required for a high-stakes emergency response platform.

## Decision: Event-Driven Resilient Architecture

### 1. System Architecture Diagram
```mermaid
graph TD
    subgraph Edge_Layer [Edge IoT Layer]
        ESP32[ESP32 IMU Sensor] -->|Impact Detected| Buffer[Offline Buffer]
        Buffer -->|Sync| Gateway
    end

    subgraph Connectivity_Layer [API Gateway & Orchestration]
        Gateway[Node.js API Gateway] -->|Validate| Zod[Zod Schema Validation]
        Zod -->|Queue| Redis[Event Queue/Redis]
        Redis -->|Process| Dispatcher[Dispatch Service]
        Dispatcher -->|Analyze| AI[Aegis-Core AI Qwen 2.5]
    end

    subgraph Service_Orchestration [Emergency State Machine]
        Dispatcher -->|State Change| SM[SOS State Machine]
        SM -->|CREATED| Log[Audit Logger]
        SM -->|DISPATCHED| Socket[Socket.io Real-time Hub]
        SM -->|ACCEPTED| Dashboard[Next.js Dispatcher Dashboard]
    end

    subgraph Response_Network [Global Resource Discovery]
        SM -->|Route| OSM[OSM Overpass API]
        OSM -->|Nearest| Responders[Police/Ambulance/Towing]
    end
```

### 2. SOS Lifecycle (State Machine)
To ensure fault tolerance and accountability, every alert follows a strict state machine:
`CREATED` → `ANALYZING` → `DISPATCHED` → `ACCEPTED` → `IN_PROGRESS` → `RESOLVED` | `FAILED`

## Consequences
- **Positive:** Full audit trail for every accident. Decoupled AI analysis and resource routing.
- **Negative:** Slightly higher latency due to state persistence (mitigated by optimized Postgres queries).
