# ADR 04: Security Framework

## Status
Accepted

## Context
Handling telemetry and location data requires strict adherence to security best practices to prevent unauthorized access and data tampering.

## Decision: OWASP-Aligned Hardening
The system will implement a multi-layered security framework:

1. **API Protection:**
   - **Helmet.js:** To set secure HTTP headers.
   - **Rate Limiting:** `express-rate-limit` to prevent DDoS on ingestion endpoints.
2. **AI Security:**
   - **Prompt Injection Defense:** Aegis-Core utilizes a strict XML-delimited system prompt to prevent overrides.
   - **Evals:** Automated harness in `tools/evals/prompt-bench` to test for common injection patterns.
3. **Static Analysis:**
   - Custom SAST tool (`tools/security/sast/static-analyzer.js`) integrated into CI to detect `eval()` usage and hardcoded secrets.

## Consequences
- **Positive:** High resistance to common web vulnerabilities.
- **Negative:** Minimal performance overhead due to security headers and rate limits.
