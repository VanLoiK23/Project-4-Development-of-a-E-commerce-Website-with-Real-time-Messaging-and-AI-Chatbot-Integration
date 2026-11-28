import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
  children?: React.ReactNode;
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-[640px]",
  md: "max-w-[768px]",
  lg: "max-w-[1024px]",
  xl: "max-w-[1200px]",
  "2xl": "max-w-[1360px]",
  full: "max-w-full",
};

/**
 * Standard Layout Container conforming to design-tokens.md §3.2 and design-system.md §9.2.
 * Responsive padding: mobile 16px (px-4), tablet 24px (px-6), desktop 32px (px-8).
 * Default size is "xl" (1200px max width) for standard storefront catalog, PDP, header, footer.
 */
export function Container({
  as: Component = "div",
  size = "xl",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
