import { EmergencyWizard } from "@/features/EmergencyRequest/ui/EmergencyWizard"

export default function Page() {
  return (
    <div className="flex-1 bg-emergency-bg h-full p-4 md:p-6 lg:p-8">
      <EmergencyWizard />
    </div>
  )
}
