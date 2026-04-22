/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

import { useEffect, useRef } from 'react';

/**
 * AUTOMATED CRASH DETECTION HOOK
 * Monitors high-frequency accelerometer data to detect impact signatures.
 */
export const useCrashDetection = (onCrashDetected) => {
  const lastMagnitude = useRef(0);
  const CRASH_G_THRESHOLD = 18.0; // Standard threshold for high-impact vehicular collisions

  useEffect(() => {
    const handleMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;

      // CALCULATE RESULTANT G-FORCE (Ares)
      const Ares = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2) / 9.81; // Convert to G units
      
      // DETECT SUDDEN DELTA (dV/dt spike)
      if (Ares > CRASH_G_THRESHOLD && Ares > lastMagnitude.current * 1.5) {
        console.warn(`[Aegis-Edge] Impact Detected: ${Ares.toFixed(2)}G`);
        
        onCrashDetected({
          magnitude_g: Ares,
          timestamp: Date.now(),
          coordinates: { lat: null, lon: null }, // To be populated by GPS hook
          hardware_signature: 'MOBILE_CLIENT_INTEGRATED'
        });
      }

      lastMagnitude.current = Ares;
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    } else {
      console.error("[Aegis-Edge] DeviceMotionEvent not supported on this platform.");
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [onCrashDetected]);
};
