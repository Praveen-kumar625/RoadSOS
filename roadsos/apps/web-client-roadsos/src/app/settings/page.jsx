"use client";

import React from "react";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center"
    >
      <div className="h-24 w-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Settings className="h-12 w-12 text-white/50" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">App Settings</h1>
      <p className="text-white/50">Settings configuration coming soon.</p>
    </motion.div>
  );
}
