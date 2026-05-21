/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

"use client";
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

export default function PrivacyConsent() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:w-96 z-50 animate-in slide-in-from-bottom-10">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Privacy & Ethics Compliance</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">
          RoadSoS collects real-time location and IMU telemetry only during emergency events. 
          Data is used strictly for responder dispatch and is anonymized after 24 hours. 
          By using this dashboard, you consent to secure data sharing with mandated emergency services.
        </p>

        <div className="flex gap-3">
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-2 rounded-lg transition-all"
          >
            I CONSENT
          </button>
          <a 
            href="/docs/privacy-policy" 
            className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold py-2 rounded-lg text-center transition-all"
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </div>
  );
}
