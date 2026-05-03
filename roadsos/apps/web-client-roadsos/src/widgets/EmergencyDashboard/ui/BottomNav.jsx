import { Home, History, Bell, User } from "lucide-react"
import { Button } from "@/shared/ui/button"
import Link from "next/link"

export function BottomNav() {
  return (
    <nav aria-label="Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-50">
      {/* Dynamic Glow behind SOS */}
      <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-40 h-24 bg-primary/20 blur-[50px] pointer-events-none rounded-full" aria-hidden="true" />
      
      <div className="relative glass-card border-x-0 border-b-0 rounded-t-[40px] h-24 px-8 flex items-center justify-between shadow-[0_-15px_50px_rgba(0,0,0,0.6)]">
        <div className="flex flex-1 justify-between items-center pr-4">
          <button 
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all active:scale-95"
            aria-label="Home page"
            aria-current="page"
          >
            <Home className="h-6 w-6" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all active:scale-95"
            aria-label="History log"
          >
            <History className="h-6 w-6" />
            <span className="text-[10px] font-semibold">History</span>
          </button>
        </div>

        <div className="relative -top-10 scale-110 px-6 z-10">
           <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full animate-pulse pointer-events-none" aria-hidden="true" />
           <Link href="/request-ambulance" tabIndex={-1}>
             <Button 
               aria-label="Emergency SOS - Request Ambulance immediately"
               className="h-20 w-20 rounded-full border-[6px] border-[#0A0D14] flex items-center justify-center text-xl font-bold bg-primary text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:bg-primary/90 focus-visible:ring-4 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0D14] focus-visible:ring-primary"
             >
               SOS
             </Button>
           </Link>
        </div>

        <div className="flex flex-1 justify-between items-center pl-4">
          <button 
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all active:scale-95"
            aria-label="Notifications and Alerts"
          >
            <Bell className="h-6 w-6" />
            <span className="text-[10px] font-semibold">Alerts</span>
          </button>
          <button 
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary outline-none transition-all active:scale-95"
            aria-label="User Profile"
          >
            <User className="h-6 w-6" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
