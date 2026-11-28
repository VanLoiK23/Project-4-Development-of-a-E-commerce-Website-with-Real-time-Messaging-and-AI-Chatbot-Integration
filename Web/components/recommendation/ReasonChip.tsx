import React from "react";
import { cn } from "@/lib/utils";

export interface ReasonChipProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ReasonChip conforming to component-guidelines.md §4.8.
 * Transparent factual reasoning explaining recommendation basis.
 */
export function ReasonChip({ children, className }: ReasonChipProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs text-ink-2 bg-surface-subtle border border-line/60 truncate max-w-full",
        className
      )}
    >
      <span className="truncate">{children}</span>
    </div>
  );
}
