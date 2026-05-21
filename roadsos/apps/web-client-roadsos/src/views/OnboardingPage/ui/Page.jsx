"use client";

import * as React from "react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { ArrowRight, ShieldCheck, Zap, Globe2, HeartPulse, Activity } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const FEATURE_CARDS = [
  {
    icon: Globe2,
    title: "Offline First",
    desc: "Seamless protection even without internet.",
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    icon: ShieldCheck,
    title: "Data Secure",
    desc: "Military-grade encryption for your telemetry.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    icon: Zap,
    title: "Ultra Fast",
    desc: "Direct PostGIS routing for minimal delay.",
    color: "text-red-400",
    bg: "bg-red-500/10"
  }
];

export function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0A0D14] text-white overflow-hidden selection:bg-red-500/30">
      
      {/* 1. ANIMATED BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] -left-[10%] w-[50%] h-[50%] bg-red-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative flex-1 flex flex-col items-center px-6 py-12 max-w-lg mx-auto w-full">
        
        {/* 2. HERO HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-6 mb-12"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full scale-150" />
             <div className="relative h-28 w-28 flex items-center justify-center bg-[#1C1C1E] border-2 border-red-500/30 rounded-[32px] shadow-2xl">
                <div className="flex flex-col items-center justify-center relative">
                   {/* Custom SOS Shield Logo */}
                   <svg width="60" height="70" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                     <path d="M24 0L48 10.5V26.5C48 40.5 37.5 53 24 56C10.5 53 0 40.5 0 26.5V10.5L24 0Z" fill="#0A0D14" stroke="#EF4444" strokeWidth="2.5"/>
                     <path d="M24 16V40M12 28H36" stroke="white" strokeWidth="5" strokeLinecap="round"/>
                   </svg>
                   <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-8 -left-8 -right-8 -bottom-8 border border-red-500/20 rounded-full"
                   />
                </div>
             </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-tight">
              Road<span className="text-red-500">SOS</span>
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Activity className="h-4 w-4 text-red-500" />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">Next-Gen Emergency Mesh</p>
            </div>
          </div>
        </motion.div>

        {/* 3. CENTERPIECE VISUAL */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative w-full aspect-[16/10] mb-12 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl group"
        >
           <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent z-10" />
           <img 
            src="/ambulance_onboarding.png" 
            alt="RoadSOS Visual"
            className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-110 transition-transform duration-[5s]"
           />
           
           <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <HeartPulse className="h-5 w-5 text-red-500 animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white/40">Active Status</p>
                  <p className="text-sm font-bold text-white">Monitoring Telemetry...</p>
                </div>
              </div>
           </div>
        </motion.div>

        {/* 4. FEATURE GRID */}
        <div className="grid grid-cols-1 gap-4 w-full mb-12">
          {FEATURE_CARDS.map((feature, idx) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + (idx * 0.1) }}
              className="flex items-center gap-5 p-5 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-colors group cursor-default"
            >
              <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center shrink-0 transition-transform group-hover:rotate-6`}>
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-snug">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 5. ACTION FOOTER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-auto w-full space-y-6"
        >
          <Link href="/dashboard" className="block w-full group">
            <button className="relative w-full h-20 bg-red-600 rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.3)] active:scale-95 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[30deg] animate-[shimmer_3s_infinite]" />
              <div className="relative flex items-center justify-between px-8">
                <span className="text-xl font-black uppercase tracking-tighter italic">Activate Service</span>
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:translate-x-2 transition-transform">
                   <ArrowRight className="h-6 w-6 text-white" />
                </div>
              </div>
            </button>
          </Link>
          
          <div className="flex items-center justify-center gap-6 pb-6">
            <Link href="/auth" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Sign In</Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <Link href="/driver" className="text-sm font-bold text-white/40 hover:text-white transition-colors">Responder Login</Link>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
