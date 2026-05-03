import * as React from "react"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 italic",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground border-white/20",
        neon: "border-[#22C55E]/50 bg-[#22C55E]/10 text-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.3)]",
        tracking: "border-secondary/50 bg-secondary/10 text-secondary shadow-[0_0_10px_rgba(59,130,246,0.3)]",
        success: "border-transparent bg-[#22C55E] text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
