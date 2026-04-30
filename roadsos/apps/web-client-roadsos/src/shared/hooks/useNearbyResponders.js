/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 * Protocol: Ralph Loop (Greenfield Optimized)
 */

import { useState, useEffect } from 'react';
import { supabase } from '../api/supabase.v2.js';

/**
 * HIGH-PERFORMANCE SPATIAL HOOK
 * Fetches nearby responders directly from PostGIS via Supabase RPC.
 */
export function useNearbyResponders(lat, lon, radius = 5000) {
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lat || !lon) return;

    async function fetchResponders() {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase.rpc('get_nearby_responders_v2', {
          target_lat: lat,
          target_lon: lon,
          radius_meters: radius
        });

        if (fetchError) throw fetchError;
        setResponders(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResponders();
  }, [lat, lon, radius]);

  return { responders, loading, error };
}
