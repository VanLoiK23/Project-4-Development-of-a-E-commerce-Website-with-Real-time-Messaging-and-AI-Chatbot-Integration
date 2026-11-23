import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Server-compatible AuthCard component.
 * Centered white card with border-line and radius-lg (12px).
 * Houses exactly one h1 per page with an accompanying single-sentence description.
 */
export function AuthCard({
  title,
  description,
  children,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[440px] bg-surface rounded-lg border border-line p-6 sm:p-8 shadow-sm text-left mx-auto",
        className
      )}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-2 mt-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
