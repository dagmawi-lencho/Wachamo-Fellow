import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-gray-400 placeholder:font-light selection:bg-gradient-to-r selection:from-primary selection:to-secondary selection:text-white h-14 w-full min-w-0 rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl px-5 py-4 text-base font-medium shadow-xl shadow-primary/5 transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ring-1 ring-white/60",
        "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:bg-white/80 hover:-translate-y-0.5",
        "focus:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:shadow-2xl focus:shadow-primary/20 focus:bg-white/90 focus:scale-[1.01]",
        "aria-invalid:border-destructive/50 aria-invalid:ring-2 aria-invalid:ring-destructive/30 aria-invalid:bg-red-50/50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
