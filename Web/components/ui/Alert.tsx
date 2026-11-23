import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warn" | "danger";
  title?: string;
  children: React.ReactNode;
}

/**
 * Server-compatible Alert component.
 * Assigns role="alert" for danger (errors) and role="status" (aria-live="polite") for others.
 */
export function Alert({
  variant = "info",
  title,
  children,
  className,
  ...props
}: AlertProps) {
  const isError = variant === "danger";

  const config = {
    info: {
      container: "bg-info-soft border-info text-info",
      icon: Info,
    },
    success: {
      container: "bg-success-soft border-success text-success",
      icon: CheckCircle2,
    },
    warn: {
      container: "bg-warn-soft border-warn text-warn",
      icon: AlertTriangle,
    },
    danger: {
      container: "bg-danger-soft border-danger text-danger",
      icon: XCircle,
    },
  }[variant];

  const IconComponent = config.icon;

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={cn(
        "flex items-start gap-3 p-3.5 rounded-lg border text-sm leading-relaxed",
        config.container,
        className
      )}
      {...props}
    >
      <IconComponent className="shrink-0 mt-0.5" size={18} aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="font-semibold mb-0.5 text-ink">{title}</p>}
        <div className="text-ink">{children}</div>
      </div>
    </div>
  );
}
