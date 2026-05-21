/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: apps/web-client-roadsos/src/features/CalculateShortestDistance/a-star-algorithm.js
 */

/**
 * Optimized A* Algorithm using Haversine distance heuristic.
 * Minimal memory allocation, strict latency.
 */
class MinHeap {
  constructor() { this.data = []; }
  push(val, priority) {
    this.data.push({ val, priority });
    this.bubbleUp(this.data.length - 1);
  }
  pop() {
    if (this.data.length === 0) return null;
    const min = this.data[0];
    const end = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = end;
      this.sinkDown(0);
    }
    return min;
  }
  bubbleUp(idx) {
    const el = this.data[idx];
    while (idx > 0) {
      let pIdx = Math.floor((idx - 1) / 2);
      let parent = this.data[pIdx];
      if (el.priority >= parent.priority) break;
      this.data[pIdx] = el;
      this.data[idx] = parent;
      idx = pIdx;
    }
  }
  sinkDown(idx) {
    const len = this.data.length;
    const el = this.data[idx];
    while (true) {
      let leftIdx = 2 * idx + 1;
      let rightIdx = 2 * idx + 2;
      let left, right;
      let swap = null;

      if (leftIdx < len) {
        left = this.data[leftIdx];
        if (left.priority < el.priority) swap = leftIdx;
      }
      if (rightIdx < len) {
        right = this.data[rightIdx];
        if ((swap === null && right.priority < el.priority) || 
            (swap !== null && right.priority < left.priority)) {
          swap = rightIdx;
        }
      }
      if (swap === null) break;
      this.data[idx] = this.data[swap];
      this.data[swap] = el;
      idx = swap;
    }
  }
}

function haversineDist(coords1, coords2) {
  if (!coords1 || !coords2) return 0;
  const toRad = x => x * Math.PI / 180;
  const R = 6371e3; // Earth radius in meters
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lon - coords1.lon);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function aStar(graph, coords, start, end) {
  const gScore = new Map();
  const fScore = new Map();
  const previous = new Map();
  const pq = new MinHeap();

  for (let vertex in graph) {
    gScore.set(vertex, Infinity);
    fScore.set(vertex, Infinity);
    previous.set(vertex, null);
  }
  
  gScore.set(start, 0);
  fScore.set(start, haversineDist(coords[start], coords[end]));
  pq.push(start, fScore.get(start));

  while (pq.data.length) {
    const { val: current } = pq.pop();

    if (current === end) {
      const path = [];
      let currNode = end;
      while (currNode) {
        path.push(currNode);
        currNode = previous.get(currNode);
      }
      return { path: path.reverse(), distance: gScore.get(end) };
    }

    for (let neighbor in graph[current]) {
      let tentativeG = gScore.get(current) + graph[current][neighbor];
      if (tentativeG < gScore.get(neighbor)) {
        previous.set(neighbor, current);
        gScore.set(neighbor, tentativeG);
        const f = tentativeG + haversineDist(coords[neighbor], coords[end]);
        fScore.set(neighbor, f);
        pq.push(neighbor, f);
      }
    }
  }
  return { path: [], distance: Infinity };
}
