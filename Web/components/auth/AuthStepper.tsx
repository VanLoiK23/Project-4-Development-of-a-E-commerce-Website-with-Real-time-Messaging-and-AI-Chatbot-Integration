import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface AuthStepperProps {
  currentStep: 1 | 2;
  className?: string;
}

/**
 * Server-compatible AuthStepper component.
 * Displays explicit text alongside visual indicators:
 * "Bước 1/2 · Thông tin" -> "Bước 2/2 · Xác thực email".
 */
export function AuthStepper({ currentStep, className }: AuthStepperProps) {
  return (
    <nav
      aria-label="Tiến trình đăng ký"
      className={cn("w-full mb-6 py-2 px-3 bg-surface-subtle rounded-md border border-line", className)}
    >
      <ol className="flex items-center justify-between text-xs sm:text-sm font-medium">
        {/* Step 1 */}
        <li
          className={cn(
            "flex items-center gap-2",
            currentStep === 1 ? "text-ink font-semibold" : "text-ink-2"
          )}
          aria-current={currentStep === 1 ? "step" : undefined}
        >
          <span
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs",
              currentStep === 1
                ? "bg-brand text-ink-inverse"
                : "bg-surface text-ink-2 border border-line"
            )}
          >
            {currentStep > 1 ? <Check size={14} aria-hidden="true" /> : "1"}
          </span>
          <span>Bước 1/2 · Thông tin</span>
        </li>

        <span className="text-ink-3 mx-2" aria-hidden="true">
          /
        </span>

        {/* Step 2 */}
        <li
          className={cn(
            "flex items-center gap-2",
            currentStep === 2 ? "text-ink font-semibold" : "text-ink-3"
          )}
          aria-current={currentStep === 2 ? "step" : undefined}
        >
          <span
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs",
              currentStep === 2
                ? "bg-brand text-ink-inverse"
                : "bg-surface text-ink-3 border border-line"
            )}
          >
            2
          </span>
          <span>Bước 2/2 · Xác thực email</span>
        </li>
      </ol>
    </nav>
  );
}
