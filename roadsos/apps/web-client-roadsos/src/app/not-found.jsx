import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { MapPinOff } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-emergency-bg p-8 text-center text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-muted-foreground border border-white/10">
        <MapPinOff className="h-10 w-10" />
      </div>
      
      <h2 className="mb-2 text-2xl font-black tracking-tighter italic">
        Route Not <span className="text-primary">Found</span>
      </h2>
      
      <p className="mb-8 max-w-xs text-sm text-muted-foreground font-medium">
        The page you are looking for has been diverted or doesn't exist.
      </p>

      <Button asChild variant="emergency" className="w-full max-w-[200px]">
        <Link href="/">
          Return Home
        </Link>
      </Button>
    </div>
  )
}
