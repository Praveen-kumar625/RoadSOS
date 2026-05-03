"use client";

import * as React from "react"
import { AmbulanceRequestForm } from "@/features/RequestAmbulance/ui/AmbulanceRequestForm"
import { ChevronLeft, Headphones } from "lucide-react"

export function RequestAmbulancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-emergency-bg text-white">
      <header className="flex items-center justify-between p-6 pt-8">
        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-bold">Request Ambulance</h1>
        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <Headphones className="h-6 w-6 text-primary" />
        </button>
      </header>

      <main className="flex-1 p-6">
        <AmbulanceRequestForm />
      </main>
    </div>
  )
}
