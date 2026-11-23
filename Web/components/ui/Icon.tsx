import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
}

/**
 * Server-compatible Icon wrapper around lucide-react icons.
 * Defaults aria-hidden="true" unless explicitly provided.
 */
export function Icon({
  icon: IconComponent,
  size = 20,
  className,
  "aria-hidden": ariaHidden = true,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={size}
      strokeWidth={2}
      className={cn("shrink-0", className)}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}
