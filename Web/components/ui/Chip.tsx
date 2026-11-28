import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";

export interface ChipProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onToggle"> {
  selected?: boolean;
  onToggle?: (selected: boolean) => void;
  children: React.ReactNode;
}

/**
 * Preference Chip primitive conforming to component-guidelines.md §4.5.
 * Amber is used ONLY when selected (AI personalization preference chip).
 */
export function Chip({
  selected = false,
  onToggle,
  onClick,
  className,
  children,
  disabled,
  ...props
}: ChipProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      onToggle?.(!selected);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-sm transition-all duration-150 cursor-pointer select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        "disabled:opacity-50 disabled:pointer-events-none",
        selected
          ? "bg-ai-soft border-[1.5px] border-ai text-ai-ink font-medium shadow-sm"
          : "bg-surface border border-line text-ink-2 hover:bg-surface-subtle hover:text-ink",
        className
      )}
      {...props}
    >
      {selected && <Icon icon={Check} size={14} className="text-ai-ink shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
