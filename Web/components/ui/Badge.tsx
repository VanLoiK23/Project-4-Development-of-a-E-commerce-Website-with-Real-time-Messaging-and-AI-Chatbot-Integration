import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "sale" | "success" | "warning" | "danger" | "info" | "ai";
  size?: "sm" | "md";
  children: React.ReactNode;
}

/**
 * Badge primitive conforming to design-tokens.md §8 and component-guidelines.md §3.4, §4.1.
 * Amber is strictly reserved for variant="ai" (Match score / AI recommendations).
 */
export function Badge({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 min-h-[22px]",
    md: "text-xs font-semibold px-2.5 py-1 min-h-[24px]",
  }[size];

  const variantStyles = {
    default: "bg-surface-subtle text-ink-2 border border-line",
    sale: "bg-sale-soft text-sale font-semibold",
    success: "bg-success-soft text-success font-semibold",
    warning: "bg-warn-soft text-warn font-semibold",
    danger: "bg-danger-soft text-danger font-semibold",
    info: "bg-info-soft text-info font-semibold",
    ai: "bg-ai-soft text-ai-ink border border-ai/30 font-semibold",
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full leading-none shrink-0",
        sizeStyles,
        variantStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
