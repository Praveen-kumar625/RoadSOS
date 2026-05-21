/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: apps/web-client-roadsos/src/features/CalculateShortestDistance/dijkstra-algorithm.js
 */

/**
 * Optimized Dijkstra's Algorithm using a Min-Priority Queue.
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

export function dijkstra(graph, start, end) {
  const distances = new Map();
  const previous = new Map();
  const pq = new MinHeap();

  for (let vertex in graph) {
    distances.set(vertex, Infinity);
    previous.set(vertex, null);
  }
  
  distances.set(start, 0);
  pq.push(start, 0);

  while (pq.data.length) {
    const { val: current } = pq.pop();

    if (current === end) {
      const path = [];
      let currNode = end;
      while (currNode) {
        path.push(currNode);
        currNode = previous.get(currNode);
      }
      return { path: path.reverse(), distance: distances.get(end) };
    }

    if (distances.get(current) === Infinity) continue;

    for (let neighbor in graph[current]) {
      let d = distances.get(current) + graph[current][neighbor];
      if (d < distances.get(neighbor)) {
        distances.set(neighbor, d);
        previous.set(neighbor, current);
        pq.push(neighbor, d);
      }
    }
  }
  return { path: [], distance: Infinity };
}
