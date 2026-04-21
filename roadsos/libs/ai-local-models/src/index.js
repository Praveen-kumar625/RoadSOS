/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { HfInference } from '@huggingface/inference';

export class AegisCoreAI {
  constructor(token) {
    this.hf = new HfInference(token || 'dummy_token');
    this.model = 'Qwen/Qwen2.5-7B-Instruct';
  }

  async analyze(telemetry) {
    const start = Date.now();
    
    // 1. DETERMINISTIC RULE-BASED ANALYSIS (Primary)
    // Using standard G-force impact thresholds for road safety
    const maxG = Math.max(
      Math.abs(telemetry.accelerometer?.x || 0), 
      Math.abs(telemetry.accelerometer?.y || 0)
    );
    
    let result = {
      isCrash: maxG > 12, // Standard threshold for high-impact collision
      severity: maxG > 15 ? 'CRITICAL' : (maxG > 8 ? 'MODERATE' : 'NOMINAL'),
      confidence: 0.9,
      isFallback: false,
      method: 'RULE_BASED'
    };

    // 2. AI ENHANCEMENT (Optional)
    try {
      const prompt = `<system>You are Aegis-Core. Analyze telemetry for vehicular crash detection. Format: JSON only.</system>
      <telemetry>${JSON.stringify(telemetry)}</telemetry>`;

      const res = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: { max_new_tokens: 150, temperature: 0.1 }
      });
      
      const aiResponse = this.parseCleanJson(res.generated_text);
      if (aiResponse) {
        // AI detected something more subtle or confirmed the rule
        result = { 
          ...result, 
          ...aiResponse, 
          method: 'AI_ENHANCED',
          latency: Date.now() - start 
        };
      }
    } catch (err) {
      console.warn("[Aegis AI] Model unavailable, proceeding with Rule-Based logic.");
      result.isFallback = true;
    }

    result.latency = Date.now() - start;
    return result;
  }

  /**
   * Robust JSON parser that handles LLM noise
   */
  parseCleanJson(text) {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return null;
      return JSON.parse(match[0]);
    } catch (e) {
      return null;
    }
  }
}
