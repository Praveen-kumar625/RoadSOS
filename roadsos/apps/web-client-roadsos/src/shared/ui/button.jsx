"use client";

import * as React from "react"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-neon-red hover:bg-primary/90",
        emergency:
          "bg-emergency-gradient text-white shadow-sos-btn hover:brightness-110",
        outline:
          "border-2 border-white/20 bg-transparent hover:bg-white/10",
        secondary:
          "bg-secondary text-secondary-foreground shadow-neon-blue",
        ghost: "hover:bg-white/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-14 px-8 py-4", // 56px height
        sm: "min-h-[44px] h-11 px-6 text-sm", // WCAG AAA minimum 44px touch target
        lg: "h-16 px-10 text-base",
        icon: "min-h-[48px] min-w-[48px] h-12 w-12", // 48px touch target for icons
        xl: "h-20 px-12 text-xl", // Removed italic/font-black for readability
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "span" : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
