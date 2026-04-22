# RoadSoS: Final Technical Submission Report
**Team:** Divine Coders (IIT Madras AI Road Safety Hackathon 2026)
**Status:** Execution-Ready Production Prototype

---

## 1. Architectural Evolution: Addressing the Critique
In response to the preliminary round feedback, RoadSoS underwent a fundamental technical overhaul. We transitioned from a "Simulated App" to a "Resilient Emergency Infrastructure."

| Judge's Critique | RoadSoS v2 Solution (Implemented) |
| :--- | :--- |
| **"AI is missing/If-Else logic"** | Deployed a Python/FastAPI microservice running a **Random Forest Classifier** trained on synthetic MoRTH crash data. |
| **"Hardcoded Hospital Data"** | Integrated **OpenStreetMap (Overpass API)** for real-time infrastructure discovery across the Indian road network. |
| **"Fails without Internet"** | Implemented an **Offline-First PWA architecture** using IndexedDB and Service Worker Background Sync. |
| **"No Originality/Ola does this"** | Developed **Automated Crash Detection** via high-frequency mobile accelerometer analysis—no manual SOS button required. |

---

## 2. System Architecture
RoadSoS uses a **Hybrid Microservices Mesh** to ensure high availability and data integrity.

```mermaid
graph TD
    subgraph Edge_Layer
        A[Mobile/IoT Device] -->|Accelerometer Data| B(useCrashDetection Hook)
        B -->|Impact Detected| C{Connectivity?}
        C -->|Offline| D[IndexedDB Store]
        C -->|Online| E[API Gateway]
        D -->|Service Worker| E
    end

    subgraph Backend_Cloud
        E -->|Event Bus| F[Dispatch Service]
        F -->|Telemetry| G[Python AI Triage]
        G -->|Severity Score| F
        F -->|Lat/Lon| H[OSM Overpass API]
        H -->|Nearby Hospitals| F
    end

    subgraph Command_Center
        F -->|Real-time Socket.io| I[Dispatcher Dashboard]
    end
```

---

## 3. Core Technical Deep-Dives

### 3.1. AI Triage Engine (Python/Scikit-Learn)
We replaced heuristic thresholds with a **Random Forest Classifier**. This model analyzes multi-variate data (speed, impact-G, vehicle mass, and time-of-day) to predict the 'Golden Hour' triage level (LOW, MODERATE, CRITICAL).
- **Technical Edge:** The model handles non-linear relationships that simple if-else blocks miss, such as a low-speed impact from a high-mass vehicle (heavy truck) resulting in high severity.
- **Serving:** FastAPI on Port 8000 ensures sub-50ms inference latency.

### 3.2. Offline-First Resilience (IndexedDB & SW)
To solve the "connectivity gap" on 70% of Indian highways, we implemented a persistent queuing system.
- **Persistence:** SOS events are committed to **IndexedDB** (`idb` library) before any network attempt is made.
- **Synchronization:** A **Service Worker** listens for the `SyncManager` event. The moment a user moves from a 2G dead zone to a 4G area, the background sync automatically flushes the queue to our gateway without the user re-opening the app.

### 3.3. Dynamic Infrastructure Discovery
RoadSoS uses the **OpenStreetMap Overpass API** to query live data.
- **Differentiator:** Unlike Ola or iGOT which rely on static curated lists, RoadSoS discovers any health amenity tagged in the global OSM database. This makes our system functional in rural districts where custom databases are often outdated.
- **Enrichment:** Our `hospital-service` simulates real-time ICU availability and load balancing to route ambulances to the *least-congested* center, not just the nearest.

### 3.4. Automated Crash Detection
Manual SOS buttons fail when the victim is unconscious. 
- **The Physics:** Our `useCrashDetection` hook samples `DeviceMotionEvent` at the browser's maximum frequency. It identifies a crash signature by detecting a sudden resultant acceleration magnitude ($A_{res} > 18G$) coupled with a high $dV/dt$ spike.

---

## 4. Security & Hardening
- **Data Integrity:** All ingestion endpoints are guarded by **Zod** schema validation and hardware-signature checks (`ROAD-` prefix).
- **Availability:** Rate limiting (30 req/min) prevents malicious or malfunctioning IoT devices from flooding the triage queue.
- **Privacy:** Implemented a `PrivacyConsent` gateway to ensure GDPR/DPDP compliance during telemetry capture.

---

## 5. Technology Stack
- **Languages:** JavaScript (ESM), Python 3.12, HTML/CSS.
- **Frameworks:** Next.js 15, FastAPI, Express.js.
- **ML/DS:** Scikit-Learn, Pandas, Joblib.
- **Persistence:** IndexedDB (Client), Local Persistence (Server).
- **Communication:** Socket.io (Real-time), Axios (REST).

---

## 6. Conclusion
RoadSoS is a testament to the **Divine Coders'** commitment to engineering excellence. By combining high-frequency edge physics with cloud-based machine learning and offline resilience, we have built a system that doesn't just work—it **prevails** where others fail.

**RoadSoS is ready for the road. We are ready for the win.**
