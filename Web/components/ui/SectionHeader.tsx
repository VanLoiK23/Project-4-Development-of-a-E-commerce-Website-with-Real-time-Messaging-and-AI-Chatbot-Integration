import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  actionIcon?: boolean;
  className?: string;
  badge?: React.ReactNode;
}

/**
 * Reusable Section Header primitive conforming to page-design-guidelines.md S1 & design-system.md §9.
 */
export function SectionHeader({
  title,
  subtitle,
  actionHref,
  actionLabel,
  actionIcon = true,
  className,
  badge,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b border-line/40",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink">
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && <p className="text-sm text-ink-2 max-w-2xl">{subtitle}</p>}
      </div>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-brand-hover group shrink-0 transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span>{actionLabel}</span>
          {actionIcon && (
            <Icon
              icon={ArrowRight}
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          )}
        </Link>
      )}
    </div>
  );
}
