import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { MapPin, X, UserPlus, ChevronDown, ShieldCheck, ArrowRight } from "lucide-react"

export function AmbulanceRequestForm() {
  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="icu">ICU</TabsTrigger>
          <TabsTrigger value="neonatal">Neonatal</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <div className="w-0.5 h-6 bg-white/10" />
          </div>
          <Input 
            placeholder="Pickup Location" 
            className="pl-12 pr-10"
            defaultValue="Sector 62, Noida, UP"
          />
          <X className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
        </div>
        
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary neon-glow-red" />
          </div>
          <Input 
            placeholder="Drop Location" 
            className="pl-12 pr-10"
            defaultValue="City Hospital"
          />
          <X className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Patient Details</h3>
          <Button variant="link" size="sm" className="text-primary gap-1">
            <UserPlus className="h-4 w-4" /> Add Patient
          </Button>
        </div>
        
        <Card className="border-white/5 bg-white/5 shadow-none overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="font-bold">RS</span>
                </div>
                <div>
                  <h4 className="font-bold">Rohit Sharma</h4>
                  <p className="text-xs text-muted-foreground">32 Years • Male</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-8 rounded-lg">Edit</Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm">Fever & Breathing issue</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">High Priority</span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Additional Note (Optional)</label>
        <textarea 
          className="w-full min-h-[100px] rounded-2xl border border-white/10 bg-white/5 p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          placeholder="Any additional information..."
        />
      </div>

      <div className="space-y-4 pt-4">
        <Button variant="emergency" className="w-full h-16 text-lg font-bold gap-2">
          Confirm Request <ArrowRight className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>Your request is secure & data is encrypted.</span>
        </div>
      </div>
    </div>
  )
}
