/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import axios from 'axios';

/**
 * PRODUCTION SECRET MANAGEMENT (HASHICORP VAULT)
 * Replaces insecure environment variables for safety-critical keys.
 */
export class VaultService {
  constructor() {
    this.vaultAddr = process.env.VAULT_ADDR || 'http://vault:8200';
    this.vaultToken = process.env.VAULT_TOKEN || 'root';
  }

  /**
   * Fetches secrets from Vault KV engine.
   * Path: secret/data/roadsos/production
   */
  async getSecrets() {
    console.log(`🔒 [Vault] Fetching secrets from ${this.vaultAddr}...`);
    try {
      // For the Greenfield prototype, we use the HTTP API directly to avoid SDK dependency issues.
      const response = await axios.get(`${this.vaultAddr}/v1/secret/data/roadsos/production`, {
        headers: { 'X-Vault-Token': this.vaultToken }
      });
      
      const secrets = response.data.data.data;
      console.log('✅ [Vault] Secrets successfully synchronized.');
      return secrets;
    } catch (err) {
      console.warn('⚠️ [Vault] Failure to fetch from Vault, falling back to ENV:', err.message);
      return process.env; // Fallback to ENV for local dev/migration
    }
  }
}

export const vaultService = new VaultService();
