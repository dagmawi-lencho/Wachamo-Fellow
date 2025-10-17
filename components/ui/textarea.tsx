import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-gray-400 placeholder:font-light selection:bg-gradient-to-r selection:from-primary selection:to-secondary selection:text-white flex field-sizing-content min-h-32 w-full rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl px-5 py-4 text-base font-medium shadow-xl shadow-primary/5 transition-all duration-300 outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y leading-relaxed ring-1 ring-white/60",
        "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:bg-white/80 hover:-translate-y-0.5",
        "focus:border-primary/50 focus:ring-2 focus:ring-primary/30 focus:shadow-2xl focus:shadow-primary/20 focus:bg-white/90 focus:scale-[1.005]",
        "aria-invalid:border-destructive/50 aria-invalid:ring-2 aria-invalid:ring-destructive/30 aria-invalid:bg-red-50/50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
