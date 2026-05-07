import { supabase } from './supabase';

/**
 * Emergency Service Layer
 * Interacts with the Supabase backend.
 */
export const emergencyService = {
  /**
   * Submit a new emergency request.
   * @param {Object} data 
   * @param {string} data.location
   * @param {string} data.emergencyType
   * @param {string} data.details
   */
  async submitRequest(data) {
    try {
      // Create request payload
      const requestPayload = {
        id: Math.random().toString(36).substr(2, 9),
        location: data.location,
        emergency_type: data.emergencyType,
        details: data.details,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      // Try Supabase first
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data: responseData, error } = await supabase
          .from('emergency_requests')
          .insert([requestPayload])
          .select();

        if (!error) return { success: true, data: responseData[0] };
      }

      // Fallback to local storage (Mock backend)
      const existing = JSON.parse(localStorage.getItem('mock_emergencies') || '[]');
      localStorage.setItem('mock_emergencies', JSON.stringify([requestPayload, ...existing]));
      
      // Simulate network delay
      await new Promise(r => setTimeout(r, 500));
      return { success: true, data: requestPayload };
    } catch (err) {
      console.error("Emergency submit failed:", err);
      return { success: false, error: err.message };
    }
  },

  async getActiveRequests() {
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const { data, error } = await supabase
          .from('emergency_requests')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        if (!error && data) return data;
      }
      
      // Fallback
      return JSON.parse(localStorage.getItem('mock_emergencies') || '[]').filter(req => req.status === 'pending');
    } catch (err) {
      console.warn("Failed to fetch from Supabase, returning local mock", err);
      return JSON.parse(localStorage.getItem('mock_emergencies') || '[]').filter(req => req.status === 'pending');
    }
  }
};
