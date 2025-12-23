import { Sparkles } from "lucide-react"

interface InsightCardProps {
  text: string
}

export function InsightCard({ text }: InsightCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 backdrop-blur-xl border border-purple-500/20 shadow-[0_4px_16px_0_rgba(0,0,0,0.25)]">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/30 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-purple-300" />
        </div>
        <p className="text-sm leading-relaxed text-white">{text}</p>
      </div>
    </div>
  )
}
