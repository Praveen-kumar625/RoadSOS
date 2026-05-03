import { Home, History, Bell, User } from "lucide-react"
import { Button } from "@/shared/ui/button"

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glow effect for SOS */}
      <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-32 h-20 bg-primary/20 blur-3xl pointer-events-none rounded-full" />
      
      <div className="relative glass-card border-x-0 border-b-0 rounded-t-[32px] px-6 py-4 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-1 justify-around">
          <button className="flex flex-col items-center gap-1 text-primary">
            <Home className="h-6 w-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <History className="h-6 w-6" />
            <span className="text-[10px] font-medium">History</span>
          </button>
        </div>

        <div className="relative -top-10 px-4">
          <Button 
            variant="emergency" 
            size="xl" 
            className="h-20 w-20 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.6)] border-4 border-[#0A0D14] flex items-center justify-center text-2xl font-black italic tracking-tighter"
          >
            SOS
          </Button>
        </div>

        <div className="flex flex-1 justify-around">
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <Bell className="h-6 w-6" />
            <span className="text-[10px] font-medium">Alerts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-muted-foreground">
            <User className="h-6 w-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
