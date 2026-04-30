/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 * Module: Hybrid Logical Clock (HLC)
 */

/**
 * HLC Implementation for Causal Ordering
 * Combines physical wall clock with a logical counter to guarantee:
 * 1. Strict monotonicity (no time travel)
 * 2. Causal relationship tracking between Edge and Cloud.
 */
export class HybridLogicalClock {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.lastWallTime = 0;
    this.logicalCounter = 0;
  }

  /**
   * Generates a unique, sortable timestamp.
   * Format: <wall_time>:<counter>:<node_id>
   */
  now() {
    const wallTime = Date.now();
    
    if (wallTime > this.lastWallTime) {
      this.lastWallTime = wallTime;
      this.logicalCounter = 0;
    } else {
      this.logicalCounter++;
    }

    return `${this.lastWallTime}:${this.logicalCounter.toString(16).padStart(4, '0')}:${this.nodeId}`;
  }

  /**
   * Updates local clock state based on an incoming remote timestamp.
   * Ensures the local clock advances past the remote event.
   */
  receive(remoteTimestamp) {
    const parts = remoteTimestamp.split(':');
    if (parts.length !== 3) return this.now();

    const [rWall, rCount] = [parseInt(parts[0], 10), parseInt(parts[1], 16)];
    const wallTime = Date.now();

    const maxWall = Math.max(this.lastWallTime, wallTime, rWall);

    if (maxWall === this.lastWallTime && maxWall === rWall) {
      this.logicalCounter = Math.max(this.logicalCounter, rCount) + 1;
    } else if (maxWall === this.lastWallTime) {
      this.logicalCounter++;
    } else if (maxWall === rWall) {
      this.logicalCounter = rCount + 1;
    } else {
      this.logicalCounter = 0;
    }

    this.lastWallTime = maxWall;
    return this.now();
  }

  /**
   * Lexicographical comparison helper.
   */
  static compare(t1, t2) {
    return t1.localeCompare(t2);
  }
}
