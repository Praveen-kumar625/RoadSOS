"use client";

import React from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center"
    >
      <div className="h-24 w-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
        <User className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">My Profile</h1>
      <p className="text-white/50">This feature is coming soon.</p>
    </motion.div>
  );
}
