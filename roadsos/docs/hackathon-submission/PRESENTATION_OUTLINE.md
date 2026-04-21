# RoadSoS: Hackathon Presentation Outline (7 Slides)

## Team: Divine Coders (IIT Madras 2026)

---

### Slide 1: Welcome
**Visuals:** Team Logo, RoadSoS Logo, Banner: "Saving Lives in the Golden Hour."
**Script:** 
"Good morning, judges. We are Team Divine Coders, and today we are here to present **RoadSoS**. In the next few minutes, we will show you how we are using Edge AI and global spatial data to ensure that no road accident in India—or the world—goes unnoticed, ensuring immediate response within the life-saving Golden Hour."

---

### Slide 2: Problem Statement & RoadSoS Architecture
**Visuals:** High-level diagram showing Edge (ESP32) -> Cloud (Node.js) -> User (Dispatcher Dashboard). Key stat: "150,000+ lives lost annually on Indian roads."
**Script:** 
"India faces a critical challenge: delayed emergency reporting. In remote areas, accidents often go unreported for hours. Our solution, RoadSoS, is a three-tier ecosystem. We integrate high-fidelity Edge sensors for impact detection, an intelligent API Gateway for severity validation, and a real-time Dispatcher Hub for coordinated rescue."

---

### Slide 3: Offline-First Edge IoT & Qwen 2.5 Integration
**Visuals:** Image of ESP32 sensor. Code snippet of Aegis-Core prompt. Diagram of the 'Offline Buffer'.
**Script:** 
"What makes us unique? Resilience. Our Edge Firmware features an **Offline-First architecture**, buffering data during network outages. Once online, it leverages **Aegis-Core AI**, powered by Qwen 2.5, to analyze complex IMU telemetry. This hybrid approach ensures that a pothole is never mistaken for a crash, while every real impact is validated with near-perfect accuracy."

---

### Slide 4: Global Applicability via OSM Spatial Indexing
**Visuals:** Interactive map showing dynamic points for Police, Hospitals, and Towing services. 
**Script:** 
"RoadSoS is not bound by static databases. Using the **OpenStreetMap Overpass API**, our system dynamically fetches the closest Police Stations, Ambulances, and even Towing services globally. Whether you're in the heart of Chennai or a highway in Europe, RoadSoS adapts its spatial awareness in real-time to find the exact help you need, exactly where you are."

---

### Slide 5: Business Model & Scalability
**Visuals:** 2x2 Matrix showing 'Public Sector (NHAI/Police)' and 'Private Sector (Logistics/Insurance)'. 
**Script:** 
"Our business model is built on scalability. For governments, RoadSoS provides a low-cost infrastructure for national road safety. For private logistics and insurance firms, it offers precise telemetry for risk management and asset protection. Built as a unified monorepo, our services can be deployed via Docker in minutes, making city-wide expansion technically trivial."

---

### Slide 6: Demonstration / Output
**Visuals:** GIF/Video of the Next.js Dashboard. Impact waveforms spikes during a crash event. "SOS DISPATCHED" alert flashing.
**Script:** 
"Let’s look at the output. Here you see the dispatcher’s view. As the vehicle encounters an impact, the waveform spikes. Within milliseconds, Aegis-Core issues a 'CRITICAL' verdict, and the Dynamic Routing Hub immediately locks onto the nearest trauma center. What you are seeing is the difference between a fatality and a recovery."

---

### Slide 7: Thank You (Mandatory)
**Visuals:** Team photo, GitHub QR Code, "Divine Coders: Engineering Safety."
**Script:** 
"Thank you for your time. RoadSoS is more than just a project; it's a commitment to using engineering to protect every citizen on the road. We are now open for your questions."
