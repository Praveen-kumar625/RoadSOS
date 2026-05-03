import { Phone, MessageSquare, Star } from "lucide-react"
import { Button } from "@/shared/ui/button"

export function DriverInfo({ driver, className }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-white mb-5">Driver Details</h3>
      <div className="flex items-center gap-5">
        <div className="relative h-[68px] w-[68px]">
          <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
          <div className="relative h-full w-full rounded-full border-2 border-white/10 p-0.5 overflow-hidden">
            <img 
              src={driver.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi"} 
              alt={driver.name}
              className="h-full w-full object-cover rounded-full"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-lg text-white">{driver.name}</h4>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-white/80">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-medium">{driver.rating}</span>
            </div>
          </div>
          <p className="text-xs text-white/70">{driver.experience}+ years experience</p>
        </div>
        <div className="flex gap-3">
          <Button size="icon" className="h-[52px] w-[62px] rounded-[20px] bg-green-500 text-white shadow-lg border-none hover:brightness-110">
            <Phone className="h-6 w-6 fill-current stroke-[2.5]" />
          </Button>
          <Button size="icon" variant="outline" className="h-[52px] w-[52px] rounded-[20px] border-white/20">
            <MessageSquare className="h-6 w-6 stroke-[2.5]" />
          </Button>
        </div>
      </div>
    </div>
  )
}
