"use client";

import React, { useState } from "react";
import { ShieldAlert, Mail, Lock, ArrowRight, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/shared/api/supabase";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isLogin) {
        // Handle Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        // Handle Sign Up
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        
        // Supabase sign up might require email confirmation, but assuming auto-login for hackathon
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMsg(error.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0D14] text-white p-6 font-sans justify-center pb-24">
      <div className="w-full max-w-md mx-auto relative z-10">
        
        {/* Logo and Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)] border border-red-500/20">
            <ShieldAlert className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-wide">RoadSOS</h1>
          <p className="text-white/50 mt-2 text-center">Your lifeline on the road. Fast, reliable emergency response.</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gradient background inside the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="flex bg-[#0A0D14] rounded-xl p-1 mb-6 border border-white/5 relative z-10">
            <button 
              type="button"
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/80"}`}
              onClick={() => { setIsLogin(true); setErrorMsg(""); }}
            >
              Login
            </button>
            <button 
              type="button"
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white/80"}`}
              onClick={() => { setIsLogin(false); setErrorMsg(""); }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 relative z-10">
            
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-medium p-3 rounded-xl text-center"
              >
                {errorMsg}
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required={!isLogin}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0A0D14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all"
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-white/50 hover:text-white/90 font-medium transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-[0_10px_30px_rgba(239,68,68,0.3)] active:scale-[0.98] transition-all mt-4"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
        
        {/* Quick Driver Login for Hackathon context */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link href="/driver" className="text-white/40 text-sm font-medium hover:text-white/90 transition-colors border-b border-white/10 pb-1">
            Are you a Responder? Go to Driver Dashboard
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
