import React from "react";
import { cn } from "@/lib/utils";

interface PhonePlaceholderProps extends React.SVGProps<SVGSVGElement> {
  name?: string;
  brand?: string;
  className?: string;
}

/**
 * Aesthetic Phone Vector Placeholder Component conforming to design tokens.
 * Uses warm canvas / surface / charcoal tones. Never uses external images.
 */
export function PhonePlaceholder({
  name,
  brand = "Brand",
  className,
  ...props
}: PhonePlaceholderProps) {
  return (
    <div
      className={cn(
        "relative w-full aspect-square flex items-center justify-center p-4 bg-surface rounded-xl select-none group-hover:scale-[1.03] transition-transform duration-200",
        className
      )}
    >
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[200px] drop-shadow-sm"
        aria-hidden="true"
        {...props}
      >
        {/* Phone outer bezel */}
        <rect
          x="38"
          y="15"
          width="124"
          height="210"
          rx="24"
          className="fill-surface stroke-line"
          strokeWidth="3"
        />
        {/* Screen inner area */}
        <rect
          x="44"
          y="22"
          width="112"
          height="196"
          rx="18"
          className="fill-surface-subtle/70"
        />
        {/* Speaker / Dynamic Island */}
        <rect
          x="82"
          y="28"
          width="36"
          height="8"
          rx="4"
          className="fill-ink/20"
        />
        {/* Subtle camera lens reflection on back or display */}
        <circle cx="100" cy="95" r="28" className="fill-surface/60" />
        <circle cx="100" cy="95" r="20" className="fill-ink/10" />
        <circle cx="100" cy="95" r="10" className="fill-ink/20" />
        {/* Home indicator bar */}
        <rect
          x="75"
          y="206"
          width="50"
          height="4"
          rx="2"
          className="fill-ink/30"
        />
      </svg>
      {/* Brand & model label overlay */}
      <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
        <span className="text-[11px] font-medium text-ink-3 truncate block px-2">
          {name ? `${brand} • ${name}` : brand}
        </span>
      </div>
    </div>
  );
}
