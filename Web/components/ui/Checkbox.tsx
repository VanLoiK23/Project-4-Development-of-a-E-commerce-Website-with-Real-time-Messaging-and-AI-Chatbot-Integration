import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string | null;
  containerClassName?: string;
}

/**
 * Server-compatible Checkbox component.
 * Features an 18x18px boundary with accessible touch area.
 */
export function Checkbox({
  label,
  error,
  id,
  name,
  className,
  containerClassName,
  disabled,
  checked,
  onChange,
  required,
  ...props
}: CheckboxProps) {
  const generatedId = id || name;
  const errorId = error && generatedId ? `${generatedId}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1 w-full text-left", containerClassName)}>
      <label
        htmlFor={generatedId}
        className={cn(
          "flex items-start gap-3 cursor-pointer select-none text-sm leading-snug text-ink",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input
            type="checkbox"
            id={generatedId}
            name={name}
            disabled={disabled}
            required={required}
            checked={checked}
            onChange={onChange}
            aria-invalid={Boolean(error)}
            aria-describedby={errorId}
            className={cn(
              "w-[18px] h-[18px] rounded border transition-colors cursor-pointer",
              "border-line bg-surface accent-brand text-brand",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              error && "border-danger",
              className
            )}
            {...props}
          />
        </div>
        <span className="text-ink">{label}</span>
      </label>

      {error && (
        <p
          id={errorId}
          className="text-xs text-danger flex items-center gap-1.5 mt-0.5 pl-7 leading-normal"
          role="alert"
        >
          <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
