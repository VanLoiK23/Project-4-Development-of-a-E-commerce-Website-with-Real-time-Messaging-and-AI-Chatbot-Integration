import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export interface MatchScoreBadgeProps {
  matchPercent: number; // e.g. 95
  className?: string;
}

/**
 * MatchScoreBadge conforming to component-guidelines.md §4.2.
 * Strictly uses amber layer for AI personalization affinity.
 */
export function MatchScoreBadge({
  matchPercent,
  className,
}: MatchScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-semibold leading-none shrink-0",
        "bg-ai-soft text-ai-ink border border-ai/30 shadow-xs",
        className
      )}
      aria-label={`Điểm phù hợp với bạn: ${matchPercent} phần trăm`}
    >
      <Icon icon={Sparkles} size={13} className="text-ai shrink-0" />
      <span>{matchPercent}% Phù hợp</span>
    </span>
  );
}
