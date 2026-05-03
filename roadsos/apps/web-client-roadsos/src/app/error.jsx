"use client";

/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: apps/web-client-roadsos/src/app/error.jsx
 */

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-emergency-bg p-8 text-center text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary neon-glow-red">
        <AlertTriangle className="h-10 w-10" />
      </div>
      
      <h2 className="mb-2 text-2xl font-black tracking-tighter italic">
        Oops! Something went <span className="text-primary">wrong</span>
      </h2>
      
      <p className="mb-8 max-w-xs text-sm text-muted-foreground font-medium">
        We encountered an unexpected emergency in our code. Please try again.
      </p>

      <div className="flex w-full flex-col gap-4 max-w-[200px]">
        <Button 
          variant="emergency" 
          className="w-full gap-2"
          onClick={() => reset()}
        >
          <RefreshCcw className="h-4 w-4" /> Try Again
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-white/10"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
