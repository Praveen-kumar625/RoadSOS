# ADR 03: Spatial Algorithms Strategy

## Status
Accepted

## Context
To achieve precision triage, the system must dynamically identify the nearest trauma centers relative to a crash site without relying on a static, potentially outdated database.

## Decision: Dynamic OSM Discovery
We will use the **OpenStreetMap (OSM) Overpass API** for real-time spatial indexing.

### Algorithm:
1. Receive `lat`, `lon` from crash telemetry.
2. Execute a radius-based query (default: 5km) for `amenity=hospital`.
3. Filter results for `emergency=yes` where available.
4. Calculate Haversine distance to rank the nearest facilities.
5. **Fallback:** If the Overpass API is unavailable, the system defaults to a pre-indexed regional trauma center list.

## Consequences
- **Positive:** Global compatibility; no database maintenance required.
- **Negative:** Dependency on external network stability (mitigated by fallback logic).
