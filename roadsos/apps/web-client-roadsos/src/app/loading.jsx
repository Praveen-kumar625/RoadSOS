import { Ambulance } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-emergency-bg p-8">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-bounce">
          <Ambulance className="h-12 w-12 text-white" />
        </div>
      </div>
      
      <div className="mt-12 flex flex-col items-center gap-2">
        <h2 className="text-xl font-black tracking-tighter italic text-white">
          Road<span className="text-primary">SOS</span>
        </h2>
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </div>
  )
}
