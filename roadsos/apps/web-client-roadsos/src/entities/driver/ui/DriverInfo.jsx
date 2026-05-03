import { Phone, MessageSquare, Star } from "lucide-react"
import { Button } from "@/shared/ui/button"

export function DriverInfo({ driver, className }) {
  return (
    <div className={className}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Driver Details</h3>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-white/10 border border-white/10 overflow-hidden">
          <img 
            src={driver.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi"} 
            alt={driver.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-lg">{driver.name}</h4>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{driver.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{driver.experience}+ years experience</p>
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="secondary" className="rounded-full bg-green-500/20 text-green-500 border-none shadow-none">
            <Phone className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <MessageSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
