import { Button } from "@/shared/ui/button"
import { Ambulance, Cross, Hospital, Droplet, Heart, Phone } from "lucide-react"

export function ActionGrid() {
  const actions = [
    { label: "Request Ambulance", icon: Ambulance, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Medical Assistance", icon: Cross, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Nearby Hospitals", icon: Hospital, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Blood Request", icon: Droplet, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Volunteer Now", icon: Heart, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Emergency Contacts", icon: Phone, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((action, i) => (
        <button 
          key={i} 
          className="flex flex-col items-center gap-2 group outline-none focus:ring-1 focus:ring-primary/20 rounded-2xl p-2 transition-active active:scale-95"
        >
          <div className={`h-16 w-16 rounded-2xl ${action.bg} flex items-center justify-center transition-all group-hover:scale-105 border border-white/5`}>
            <action.icon className={`h-8 w-8 ${action.color}`} />
          </div>
          <span className="text-[10px] font-bold text-center leading-tight text-muted-foreground group-hover:text-foreground">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}
