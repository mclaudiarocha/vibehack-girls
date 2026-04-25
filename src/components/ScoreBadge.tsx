import { type ScoreLevel, LEVEL_LABEL } from "@/lib/iris";
import { ShieldCheck, ShieldAlert, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES: Record<ScoreLevel, string> = {
  seguro: "bg-safe/15 text-safe border-safe/30",
  atencao: "bg-warn/15 text-warn-foreground border-warn/40",
  risco: "bg-risk/15 text-risk border-risk/30",
  insuficiente: "bg-muted text-muted-foreground border-border",
};

const ICONS: Record<ScoreLevel, React.ComponentType<{ className?: string }>> = {
  seguro: ShieldCheck,
  atencao: AlertTriangle,
  risco: ShieldAlert,
  insuficiente: Sparkles,
};

interface Props {
  level: ScoreLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function ScoreBadge({ level, size = "md", className }: Props) {
  const Icon = ICONS[level];
  const sizes = {
    sm: "text-xs px-2.5 py-1 gap-1.5",
    md: "text-sm px-3.5 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2.5",
  }[size];
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        STYLES[level],
        sizes,
        className
      )}
    >
      <Icon className={iconSize} />
      {LEVEL_LABEL[level]}
    </span>
  );
}