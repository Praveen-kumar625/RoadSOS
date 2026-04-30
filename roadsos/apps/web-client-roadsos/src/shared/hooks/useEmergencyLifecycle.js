/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

/**
 * REAL-TIME DISPATCH ORCHESTRATOR HOOK
 * Listens for state transitions from the V2 API Gateway.
 */
export function useEmergencyLifecycle(apiUrl) {
  const [activeEvents, setActiveEvents] = useState({});
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(apiUrl);
    setSocket(s);

    s.on('v2_dispatch_updates', ({ incidentId, state }) => {
      console.log(`🔥 [Lifecycle] Update for ${incidentId}: ${state.status}`);
      setActiveEvents(prev => ({
        ...prev,
        [incidentId]: state
      }));
    });

    s.on('responder_assigned', (dispatchState) => {
      setActiveEvents(prev => ({
        ...prev,
        [dispatchState.incidentId]: {
          ...prev[dispatchState.incidentId],
          status: 'DISPATCHED',
          assigned_responder: dispatchState.responder,
          eta: dispatchState.eta_minutes
        }
      }));
    });

    return () => s.disconnect();
  }, [apiUrl]);

  return { activeEvents, socket };
}
