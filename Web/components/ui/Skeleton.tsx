import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Server-compatible Skeleton loader.
 * Employs warm cream shimmer with bg-surface-subtle (no raw gray or cold white HEX).
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-subtle",
        className
      )}
      {...props}
    />
  );
}
