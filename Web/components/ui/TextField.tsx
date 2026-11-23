import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  containerClassName?: string;
}

/**
 * Server-compatible TextField component.
 * Label is always visible. Links aria-describedby with error/hint.
 * Interactive height is at least 44px for touch accessibility.
 */
export function TextField({
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
}: TextFieldProps) {
  const generatedId = id || name;
  const hintId = hint && generatedId ? `${generatedId}-hint` : undefined;
  const errorId = error && generatedId ? `${generatedId}-error` : undefined;

  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full text-left", containerClassName)}>
      <label
        htmlFor={generatedId}
        className="text-sm font-medium text-ink flex items-center justify-between"
      >
        <span>
          {label}
          {required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
        </span>
      </label>

      <div className="relative w-full">
        <input
          id={generatedId}
          name={name}
          disabled={disabled}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            "w-full min-h-[44px] px-3.5 py-2 text-base text-ink bg-surface rounded-md border transition-colors",
            "border-line placeholder:text-ink-3",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
            error && "border-danger focus-visible:outline-danger",
            disabled && "opacity-50 cursor-not-allowed bg-surface-subtle",
            className
          )}
          {...props}
        />
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
