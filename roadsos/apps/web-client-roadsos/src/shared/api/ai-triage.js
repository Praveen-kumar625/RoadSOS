import { apiClient } from "../../services/api-client.js";

/**
 * AI TRIAGE SERVICE CONNECTOR
 * Routes triage requests to the API Gateway's ingestion endpoint.
 */
export async function triageEmergency(prompt) {
  console.log("Triaging emergency via API Gateway:", prompt);
  
  try {
    return await apiClient.post("/api/triage", { prompt });
  } catch (error) {
    // Simulated RAG fallback if backend is offline
    console.warn("API Gateway unreachable, using local fallback triage.");
    return {
      priority: "High (Fallback)",
      suggestedAmbulance: "ICU",
      advice: "Keep the patient stable. Dispatching via local mesh if available."
    };
  }
}
