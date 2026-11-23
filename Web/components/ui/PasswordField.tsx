"use client";

import React, { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export interface PasswordFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  hint?: string;
  error?: string | null;
  containerClassName?: string;
}

/**
 * Client Component PasswordField.
 * Includes accessible toggle button with aria-label and aria-pressed.
 * Toggle button has min 44x44px touch target.
 * Supports ref forwarding for programmatic focus.
 */
export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      label,
      hint,
      error,
      id,
      name,
      className,
      containerClassName,
      disabled,
      required,
      ...props
    },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);

    const generatedId = id || name;
    const hintId = hint && generatedId ? `${generatedId}-hint` : undefined;
    const errorId = error && generatedId ? `${generatedId}-error` : undefined;

    const describedBy =
      [errorId, hintId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("flex flex-col gap-1.5 w-full text-left", containerClassName)}>
        <label
          htmlFor={generatedId}
          className="text-sm font-medium text-ink flex items-center justify-between"
        >
          <span>
            {label}
            {required && (
              <span className="text-danger ml-1" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </label>

        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            id={generatedId}
            name={name}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              "w-full min-h-[44px] pl-3.5 pr-12 py-2 text-base text-ink bg-surface rounded-md border transition-colors",
              "border-line placeholder:text-ink-3",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
              error && "border-danger focus-visible:outline-danger",
              disabled && "opacity-50 cursor-not-allowed bg-surface-subtle",
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            aria-pressed={showPassword}
            className="absolute right-0 h-full w-11 flex items-center justify-center text-ink-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand rounded-r-md cursor-pointer disabled:pointer-events-none"
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>

        {error ? (
          <p
            id={errorId}
            className="text-xs text-danger flex items-center gap-1.5 mt-0.5 leading-normal"
            role="alert"
          >
            <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-ink-3 leading-normal mt-0.5">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);
