import { Card, CardContent } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Ambulance } from "lucide-react"

export function AmbulanceCard({ ambulance, className }) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary neon-glow-red">
          <Ambulance className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg">Ambulance {ambulance.id}</h4>
            <Badge variant="neon">On the way</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {ambulance.distance} km away • ETA {ambulance.eta} mins
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
