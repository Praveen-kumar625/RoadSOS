"use client";

import * as React from "react"
import { AmbulanceTracker } from "@/features/LiveAmbulanceTracker/ui/AmbulanceTracker"
import { ChevronLeft, Headphones } from "lucide-react"
import Link from "next/link"

export function TrackingPage() {
  return (
    <div className="relative min-h-screen bg-emergency-bg text-white overflow-hidden">
      {/* Optional: Add a subtle top bar over the map if needed, or let AmbulanceTracker handle all UI */}
      <AmbulanceTracker />
    </div>
  )
}
