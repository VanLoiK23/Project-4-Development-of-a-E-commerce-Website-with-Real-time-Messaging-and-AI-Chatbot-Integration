import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  as?: React.ElementType;
}

const maxStyles: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
  "2xl": "1360px",
  full: "100%",
};

/**
 * Centered responsive container bound to design tokens:
 * --container-sm (640px), --container-md (768px), --container-lg (1024px),
 * --container-xl (1200px), --container-2xl (1360px).
 */
export function Container({
  size = "xl",
  as: Component = "div",
  className,
  style,
  children,
  ...props
}: ContainerProps) {
  const maxWidth = maxStyles[size];

  return (
    <Component
      style={{ maxWidth, ...style }}
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
