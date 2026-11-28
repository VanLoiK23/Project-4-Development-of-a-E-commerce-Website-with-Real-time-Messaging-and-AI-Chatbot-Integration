import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Inbox } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * EmptyState primitive conforming to component-guidelines.md §6.12.
 */
export function EmptyState({
  icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-surface rounded-xl border border-line",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-surface-subtle flex items-center justify-center mb-4 text-ink-3">
        <Icon icon={icon} size={28} />
      </div>
      <h3 className="text-lg font-semibold text-ink mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-ink-2 max-w-md mb-6">{description}</p>
      )}
      {actionLabel && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
