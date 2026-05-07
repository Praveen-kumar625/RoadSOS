"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  MapPin, AlertTriangle, ShieldAlert, 
  ChevronLeft, Navigation, FileText, CheckCircle
} from "lucide-react";
import { useOfflineSync } from "@/shared/hooks/useOfflineSync";
import { motion, AnimatePresence } from "framer-motion";

// ----------------------------------------------------------------------
// 1. Schema Validation (Zod)
// ----------------------------------------------------------------------
const emergencySchema = z.object({
  location: z.string().min(5, "Location must be more precise (min 5 chars)"),
  emergencyType: z.enum(["ambulance", "police", "fire", "towing"]),
  details: z.string().optional(),
});

type EmergencyFormValues = z.infer<typeof emergencySchema>;

// ----------------------------------------------------------------------
// 2. Component
// ----------------------------------------------------------------------
export function EmergencyWizard() {
  const router = useRouter();
  
  // Use React Suspense if this was a real app to handle useSearchParams, 
  // but for hackathon/prototype it's fine.
  let defaultType: any = "ambulance";
  try {
    const searchParams = useSearchParams();
    defaultType = searchParams.get("type") || "ambulance";
  } catch (e) {
    // Graceful fallback if used outside of suspense boundary
  }
  
  const [step, setStep] = useState(1);
  const { queueRequest, isOffline } = useOfflineSync();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      location: "",
      emergencyType: defaultType,
      details: "",
    },
  });

  const onSubmit = async (data: EmergencyFormValues) => {
    queueRequest("/api/emergencies", data);
    router.push("/tracking");
  };

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  // --- Step Variants for Framer Motion --- //
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  // --- Step Components --- //

  const LocationStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
          <MapPin className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Where are you?</h2>
          <p className="text-white/60 text-sm">We need your exact location.</p>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          type="button" 
          onClick={() => setValue("location", "Current GPS Location: 28.59N, 77.34E", { shouldValidate: true })}
          className="w-full flex items-center justify-center h-16 bg-white/10 hover:bg-white/20 border border-white/20 text-white gap-3 rounded-2xl active:scale-[0.98] transition-transform"
        >
          <Navigation className="h-5 w-5 text-blue-400" />
          <span className="font-semibold text-lg">Use Current Location</span>
        </button>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
             <MapPin className="h-5 w-5 text-white/40" />
          </div>
          <input 
            {...register("location")}
            placeholder="Or type address manually..." 
            className="w-full bg-[#0A0D14] border border-white/10 rounded-2xl h-16 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-red-500/50"
          />
        </div>
        {errors.location && <p className="text-red-500 text-sm pl-2 font-medium">{errors.location.message}</p>}
      </div>

      <button 
        type="button" 
        onClick={() => {
          if (watch("location").length >= 5) nextStep();
        }} 
        className="w-full h-16 bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.3)] mt-8 active:scale-[0.98] transition-transform flex items-center justify-center disabled:opacity-50"
        disabled={watch("location").length < 5}
      >
        Next Step
      </button>
    </div>
  );

  const TypeStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={prevStep} className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-2 hover:bg-white/10 transition-colors">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">What's wrong?</h2>
          <p className="text-white/60 text-sm">Select the type of emergency.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { id: "ambulance", label: "Ambulance", icon: ShieldAlert, color: "text-red-500" },
          { id: "police", label: "Police", icon: ShieldAlert, color: "text-blue-500" },
          { id: "fire", label: "Fire Dept", icon: AlertTriangle, color: "text-orange-500" },
          { id: "towing", label: "Tow Truck", icon: ShieldAlert, color: "text-yellow-500" },
        ].map((type) => {
          const isSelected = watch("emergencyType") === type.id;
          const Icon = type.icon;
          return (
            <div 
              key={type.id}
              onClick={() => setValue("emergencyType", type.id as any)}
              className={`cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all border ${
                isSelected 
                  ? "bg-white/10 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-105" 
                  : "bg-[#0A0D14] border-white/5 opacity-70 hover:opacity-100"
              }`}
            >
              <Icon className={`h-10 w-10 ${type.color}`} />
              <span className="font-bold text-white">{type.label}</span>
            </div>
          );
        })}
      </div>

      <button type="button" onClick={nextStep} className="w-full h-16 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-2xl shadow-[0_10px_30px_rgba(239,68,68,0.3)] mt-8 active:scale-[0.98] transition-transform">
        Continue
      </button>
    </div>
  );

  const DetailsStep = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={prevStep} className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-2 hover:bg-white/10 transition-colors">
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Any details?</h2>
          <p className="text-white/60 text-sm">Help responders prepare.</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-4 left-4 pointer-events-none">
          <FileText className="h-5 w-5 text-white/40" />
        </div>
        <textarea 
          {...register("details")}
          placeholder="e.g. 2 people injured, severe bleeding..."
          className="w-full h-32 bg-[#0A0D14] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-red-500/50 resize-none"
        />
      </div>
      {errors.details && <p className="text-red-500 text-sm pl-2">{errors.details?.message}</p>}

      <button type="submit" className="w-full h-16 bg-red-500 hover:bg-red-600 text-white font-bold text-lg rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.5)] mt-8 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform animate-pulse">
        <ShieldAlert className="h-6 w-6" />
        DISPATCH NOW
      </button>
      
      {isOffline && (
        <p className="text-orange-400 text-sm text-center font-medium mt-4 flex items-center justify-center gap-2">
           <AlertTriangle className="h-4 w-4" />
           You are offline. Request will auto-sync.
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col justify-center py-6">
      
      {/* Progress Indicators */}
      <div className="flex items-center gap-2 mb-8 px-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-white/10"
            }`} 
          />
        ))}
      </div>

      <div className="bg-[#1C1C1E] border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden relative min-h-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="h-full">
          <AnimatePresence mode="wait" custom={1}>
            {step === 1 && (
              <motion.div key="step1" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                <LocationStep />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                <TypeStep />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" custom={1} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                <DetailsStep />
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
