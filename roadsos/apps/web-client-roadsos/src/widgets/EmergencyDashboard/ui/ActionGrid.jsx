import { Ambulance, HeartPulse, Hospital, Droplets, Heart, Phone } from "lucide-react"
import Link from "next/link"

export function ActionGrid() {
  const actions = [
    { label: "Request Ambulance", icon: Ambulance, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Medical Assistance", icon: HeartPulse, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Nearby Hospitals", icon: Hospital, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Blood Request", icon: Droplets, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Volunteer Now", icon: Heart, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Emergency Contacts", icon: Phone, color: "text-orange-500", bg: "bg-orange-500/10" },
  ]

  return (
    <div className="grid grid-cols-3 gap-y-8 gap-x-4">
      {actions.map((action, i) => {
        const isAmbulance = action.label === "Request Ambulance";
        const content = (
          <button 
            key={i} 
            className="flex flex-col items-center gap-3 group outline-none active:scale-95 transition-all w-full"
          >
            <div className={`h-[72px] w-[72px] rounded-[24px] ${action.bg} flex items-center justify-center border border-white/5 shadow-xl group-hover:brightness-125`}>
              <action.icon className={`h-8 w-8 ${action.color} stroke-[2.5]`} />
            </div>
            <span className="text-xs font-semibold text-center leading-tight text-white/70 group-hover:text-white">
              {action.label}
            </span>
          </button>
        );

        if (isAmbulance) {
          return <Link href="/request-ambulance" key={i} className="w-full">{content}</Link>
        }
        return content;
      })}
    </div>
  )
}
