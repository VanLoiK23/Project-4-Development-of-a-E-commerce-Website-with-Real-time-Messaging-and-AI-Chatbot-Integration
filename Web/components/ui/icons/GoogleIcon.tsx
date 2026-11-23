import React from "react";
import { cn } from "@/lib/utils";

interface GoogleIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number;
  className?: string;
}

/**
 * Single-color currentColor Google SVG icon.
 * Preserves the project's Warm Minimalism palette without raw HEX or multi-color splashes.
 */
export function GoogleIcon({
  size = 20,
  className,
  "aria-hidden": ariaHidden = true,
  ...props
}: GoogleIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden={ariaHidden}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
    </svg>
  );
}
