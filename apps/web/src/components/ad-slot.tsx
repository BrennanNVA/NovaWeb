import { cn } from "@/lib/utils"

export interface AdSlotProps {
  label?: string
  width: number
  height: number
  className?: string
}

export function AdSlot({
  label = "Advertisement",
  width,
  height,
  className,
}: AdSlotProps) {
  return (
    <section
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-xs text-zinc-500 shadow-sm",
        "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400",
        className,
      )}
      style={{ width, height, maxWidth: "100%" }}
    >
      <span className="px-3 py-2">{label}</span>
    </section>
  )
}
