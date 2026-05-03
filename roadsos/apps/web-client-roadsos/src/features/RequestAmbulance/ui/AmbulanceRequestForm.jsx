"use client";

/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: src/features/RequestAmbulance/ui/AmbulanceRequestForm.jsx
 * Same-to-Same Implementation of Request Form Screen
 */

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import Link from "next/link"
import { X, UserPlus, ChevronDown, ShieldCheck, ArrowRight, Target } from "lucide-react"

export function AmbulanceRequestForm() {
  return (
    <div className="flex flex-col gap-10">
      {/* Type Selector */}
      <Tabs defaultValue="icu" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-14 bg-white/5 border-white/5 p-1.5 rounded-full">
          <TabsTrigger value="basic" className="text-sm font-medium h-full">Basic</TabsTrigger>
          <TabsTrigger value="icu" className="text-sm font-medium h-full">ICU</TabsTrigger>
          <TabsTrigger value="neonatal" className="text-sm font-medium h-full">Neonatal</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Location Section */}
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white px-2">Pickup Location</label>
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl cursor-text">
            <div className="flex items-start gap-4">
               <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
               <div>
                 <p className="text-sm font-medium text-white mb-0.5">Current Location</p>
                 <p className="text-xs text-white/60">Sector 62, Noida, UP</p>
               </div>
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:text-primary transition-colors">
               <Target className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white px-2">Drop Location</label>
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl cursor-text">
            <div className="flex items-start gap-4">
               <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary shadow-neon-red" />
               <div>
                 <p className="text-sm font-medium text-white mb-0.5">City Hospital</p>
                 <p className="text-xs text-white/60">Sector 30, Noida, UP</p>
               </div>
            </div>
            <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:text-primary transition-colors">
               <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Details */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-semibold text-white">Patient Details</h3>
          <button className="text-sm font-medium text-primary flex items-center gap-1.5 group">
            <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" /> Add Patient
          </button>
        </div>
        
        <Card className="glass-card border-white/10 overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-base text-white">Rohit Sharma</h4>
                  <p className="text-xs text-white/70">32 Years <span className="mx-1">•</span> Male</p>
                </div>
              </div>
              <button className="text-sm font-medium text-white/70 hover:text-white transition-colors">Edit</button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v8"/><path d="M16 9h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1"/><circle cx="17" cy="22" r="2"/></svg>
                  </div>
                  <span className="text-sm font-medium text-white">Fever & Breathing issue</span>
                </div>
                <ChevronDown className="h-5 w-5 text-white/60" />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                   </div>
                   <span className="text-sm font-semibold text-primary">High Priority</span>
                </div>
                <ChevronDown className="h-5 w-5 text-white/60" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes & CTA */}
      <div className="space-y-6 pt-2 pb-10">
        <div className="space-y-2 px-2">
          <label className="text-sm font-semibold text-white">Additional Note (Optional)</label>
          <textarea 
            className="w-full min-h-[100px] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary/40 no-scrollbar placeholder:text-white/40"
            placeholder="Any additional information..."
          />
        </div>

        <div className="space-y-5">
          <Link href="/tracking" className="block w-full">
            <Button className="w-full h-[60px] rounded-full bg-gradient-to-r from-primary to-primary/80 border border-primary text-white text-lg font-medium gap-4 justify-between px-2 pl-8 shadow-sos-btn hover:brightness-110">
              Confirm Request
              <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center">
                 <ArrowRight className="h-6 w-6 text-white" />
              </div>
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest bg-white/5 py-3 rounded-full border border-white/5 mx-4">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Secure & Encrypted Request</span>
          </div>
        </div>
      </div>
    </div>
  )
}
