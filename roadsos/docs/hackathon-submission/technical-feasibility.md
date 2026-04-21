# Technical Feasibility: RoadSoS

## Architecture Overview
RoadSoS leverages a three-tier architecture designed for low-latency and high reliability.

### 1. Edge Layer (IoT Firmware)
- **Hardware:** ESP32 Microcontrollers integrated with MPU6050 Accelerometer/Gyroscope.
- **Processing:** Local signal processing detects crash signatures (sudden decelerations, high-frequency vibrations).
- **Resilience:** Implements an offline buffer to store telemetry events when GSM/Wi-Fi signal is lost, flushing data once connectivity is restored.

### 2. Connectivity Layer (API Gateway)
- **Stack:** Node.js (Express) with Socket.io for real-time bidirectional communication.
- **AI Integration:** Uses HuggingFace Inference API (Qwen 2.5) to analyze raw telemetry data, performing natural language classification of crash severity.
- **Security:** Hardened with Helmet.js and rate limiting (OWASP best practices).

### 3. Presentation Layer (Web Client)
- **Stack:** Next.js 15 with React.
- **UI Architecture:** Feature-Sliced Design (FSD) for modularity and scalability.
- **Real-Time Data:** Live telemetry visualization using Recharts (impact waveforms) and dynamic dispatch alerts.

## Scalability and Future Proofing
- **Microservices Ready:** The architecture is decoupled; ingestion, routing, and compliance services can be scaled independently.
- **Spatial Indexing:** Uses OpenStreetMap (Overpass API) for dynamic hospital discovery, making the system functional anywhere in the world without static hospital databases.
- **Containerization:** The entire stack is Dockerized, allowing for seamless deployment on-premise or in the cloud (AWS/Azure).
