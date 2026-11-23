"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  className?: string;
}

/**
 * Client Component OtpInput.
 * 6 separate inputs with auto-advance, backspace navigation, arrow key support, and full paste handling.
 */
export function OtpInput({
  value = "",
  onChange,
  onComplete,
  disabled = false,
  error = false,
  id = "otp-input",
  className,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Format value into 6 characters
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  // Auto focus first input on mount if empty
  const hasFocusedRef = useRef(false);
  useEffect(() => {
    if (!hasFocusedRef.current && !value && inputsRef.current[0]) {
      hasFocusedRef.current = true;
      inputsRef.current[0].focus();
    }
  }, [value]);

  const handleInputChange = (index: number, char: string) => {
    // Only accept numeric digits
    const cleaned = char.replace(/\D/g, "");
    if (!cleaned) return;

    const newDigits = [...digits];
    newDigits[index] = cleaned[cleaned.length - 1]; // take the last entered char
    const newValue = newDigits.join("");
    onChange(newValue);

    // Auto advance to next input
    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newValue.length === 6 && onComplete) {
      onComplete(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous input and clear it
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputsRef.current[index - 1]?.focus();
        e.preventDefault();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    onChange(pasted);

    // Focus on the input corresponding to the length or the last one
    const focusIndex = Math.min(pasted.length, 5);
    inputsRef.current[focusIndex]?.focus();

    if (pasted.length === 6 && onComplete) {
      onComplete(pasted);
    }
  };

  return (
    <div
      role="group"
      aria-label="Nhập mã xác thực 6 chữ số"
      className={cn("flex items-center justify-between gap-2 sm:gap-3 w-full", className)}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          id={`${id}-slot-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Chữ số thứ ${index + 1} trong 6`}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "w-12 h-13 text-center text-xl font-bold text-ink bg-surface rounded-md border transition-all",
            "border-line focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
            error && "border-danger focus-visible:outline-danger",
            disabled && "opacity-50 cursor-not-allowed bg-surface-subtle"
          )}
        />
      ))}
    </div>
  );
}
