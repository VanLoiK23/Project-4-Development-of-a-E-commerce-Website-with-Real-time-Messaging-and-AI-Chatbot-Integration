import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ai" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

/**
 * Server-compatible Button component conforming to component-guidelines.md §6.1.
 * Supports primary, secondary, ai, ghost, danger variants.
 * Touch target area is at least 44px high on mobile/default.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer";

  const sizeStyles = {
    sm: "min-h-[36px] px-3 py-1 text-sm gap-1.5",
    md: "min-h-[44px] px-4 py-2 text-base gap-2",
    lg: "min-h-[48px] px-6 py-3 text-lg gap-2.5",
  }[size];

  const variantStyles = {
    // Primary: Charcoal brand color with white text
    primary:
      "bg-brand text-ink-inverse hover:bg-brand-hover focus-visible:outline-brand",
    // Secondary: Outline with border-line and hover to surface-subtle
    secondary:
      "bg-transparent border border-line text-ink hover:bg-surface-subtle",
    // AI: Amber fill with CHARCOAL text (5.2:1 contrast) - reserved for AI actions
    ai: "bg-ai text-ink hover:brightness-95",
    // Ghost: Transparent with ink-2 text
    ghost:
      "bg-transparent text-ink-2 hover:bg-surface-subtle hover:text-ink",
    // Danger: Error red with white text
    danger:
      "bg-danger text-ink-inverse hover:brightness-90",
  }[variant];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(baseStyles, sizeStyles, variantStyles, className)}
      {...props}
    >
      {loading && (
        <Loader2
          className="animate-spin shrink-0"
          size={size === "sm" ? 16 : 18}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
