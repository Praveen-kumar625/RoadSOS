/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import mqtts from 'mqtts';
import { persistenceService } from '../services/persistence-service.js';
import { queueV2 } from '../services/queue-service.js';
import { PayloadSerializer } from '../../../edge-iot-firmware/src/communication/payload-serializer.js';

/**
 * PRODUCTION MQTT-SN INSPIRED UDP GATEWAY
 * High-throughput, low-latency ingestion for edge safety alerts.
 */
export class UDPIngestionGateway {
  constructor(port = 1884) {
    this.server = mqtts.createServer({
      // QoS 0 (fire-and-forget) to reduce latency and eliminate TCP 3-way handshake overhead
      qos: 0 
    });
    this.port = port;

    this.server.on('error', (err) => {
      console.error(`🚨 [UDP-Gateway] Server Error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('publish', async (packet, client) => {
      await this.handleSOS(packet.payload, client);
    });

    this.server.on('ready', () => {
      console.log(`📡 [UDP-Gateway] Listening on port ${this.port} (MQTT-SN Protocol)`);
    });
  }

  start() {
    this.server.listen(this.port);
  }

  /**
   * LOW-LATENCY SOS HANDLER
   * Bypasses Express/TCP overhead.
   */
  async handleSOS(msg, rinfo) {
    try {
      // 1. Unpack MsgPack/Binary Payload (Mimicking MQTT-SN)
      const payload = PayloadSerializer.deserialize(msg);
      const { hardware_id, telemetry, location, timestamp, vehicle_class } = payload;

      console.log(`🔥 [UDP] Emergency Packet from ${hardware_id} [${rinfo.address}:${rinfo.port}]`);

      // 2. Immediate Durable Persistence (Redis Streams)
      const streamId = await persistenceService.appendEvent(payload);

      // 3. Dispatch to Background AI Triage
      const incidentId = `inc_udp_${Date.now().toString(36)}`;
      await queueV2.dispatchToWorker({
        incidentId,
        streamId,
        telemetry,
        location,
        timestamp,
        vehicle_class,
        hardware_id
      });

    } catch (err) {
      console.error('❌ [UDP-Gateway] Packet Ingestion Failed:', err.message);
    }
  }
}
