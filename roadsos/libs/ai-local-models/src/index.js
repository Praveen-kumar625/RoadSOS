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
    const prompt = `<system>You are Aegis-Core. Analyze telemetry for vehicular crash detection. Format: JSON only.</system>
    <telemetry>${JSON.stringify(telemetry)}</telemetry>`;

    try {
      const res = await this.hf.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: { max_new_tokens: 150, temperature: 0.1 }
      });
      
      const latency = Date.now() - start;
      const analysis = JSON.parse(res.generated_text.match(/\{[\s\S]*\}/)[0]);
      
      return { ...analysis, latency };
    } catch (err) {
      // Robust Fallback (Circuit Breaker)
      const maxG = Math.max(Math.abs(telemetry.accelerometer.x), Math.abs(telemetry.accelerometer.y));
      return {
        isCrash: maxG > 12,
        severity: maxG > 12 ? 'CRITICAL' : 'NOMINAL',
        confidence: 0.95,
        latency: Date.now() - start,
        isFallback: true
      };
    }
  }
}
