"use client";

import * as React from "react"
import { AmbulanceRequestForm } from "@/features/RequestAmbulance/ui/AmbulanceRequestForm"
import { ChevronLeft, Headphones } from "lucide-react"
import Link from "next/link"

export function RequestAmbulancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-emergency-bg text-white">
      <header className="flex items-center justify-between p-6 pt-8">
        <Link href="/dashboard" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-semibold">Request Ambulance</h1>
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
