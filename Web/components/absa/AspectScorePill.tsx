import React from "react";
import { Star, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { getSentimentLevel } from "@/lib/absa";

export interface AspectScorePillProps {
  score: number;
  label?: string; // Optional custom label, defaults to "Tích cực" / "Trung lập" / "Tiêu cực"
  showStar?: boolean;
  size?: "sm" | "md";
  mentionCount?: number;
  className?: string;
}

/**
 * AspectScorePill conforming to design-system.md §6 and component-guidelines.md §5.3.
 * Always renders both numeric score AND qualitative text label (accessibility mandate).
 * Thresholds: >= 4.0 pos, 3.0-3.9 neu, < 3.0 neg.
 * Displays "Ít dữ liệu" if mentionCount is very low (< 30).
 */
export function AspectScorePill({
  score,
  label,
  showStar = true,
  size = "md",
  mentionCount,
  className,
}: AspectScorePillProps) {
  const sentiment = getSentimentLevel(score);
  const isLowData = mentionCount !== undefined && mentionCount < 30;

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-1.5 flex-wrap", className)}>
      <span
        className={cn(
          "inline-flex items-center font-medium rounded-md leading-none border shrink-0",
          sizeStyles,
          sentiment.textClass,
          sentiment.bgSoftClass,
          sentiment.level === "pos" && "border-pos/30",
          sentiment.level === "neu" && "border-neu/30",
          sentiment.level === "neg" && "border-neg/30"
        )}
        aria-label={`Điểm đánh giá: ${score.toFixed(1)} trên 5. Mức độ: ${label || sentiment.label}`}
      >
        {showStar && <Icon icon={Star} size={size === "sm" ? 11 : 12} className="fill-current" />}
        <span className="font-bold">{score.toFixed(1)}</span>
        <span>{label || sentiment.label}</span>
      </span>

      {isLowData && (
        <span
          className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-surface-subtle text-ink-3 border border-line"
          title="Khía cạnh này có ít lượt nhắc, độ tin cậy được làm mịn"
        >
          <Icon icon={AlertCircle} size={11} />
          <span>Ít dữ liệu</span>
        </span>
      )}
    </div>
  );
}
