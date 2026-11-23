"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";

interface ResendCountdownProps {
  cooldownSeconds?: number;
  onResend: () => Promise<void>;
  disabled?: boolean;
}

/**
 * Client Component ResendCountdown.
 * Counts down from 60 seconds. Displays "Gửi lại mã sau 45 giây" then switches to "Gửi lại mã".
 * Does not announce to screen readers every second; only updates aria-live status at start and finish.
 */
export function ResendCountdown({
  cooldownSeconds = 60,
  onResend,
  disabled = false,
}: ResendCountdownProps) {
  const [secondsLeft, setSecondsLeft] = useState(cooldownSeconds);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (secondsLeft > 0 || isResending || disabled) return;
    setIsResending(true);
    try {
      await onResend();
      setSecondsLeft(cooldownSeconds);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1 text-sm mt-3">
      {secondsLeft > 0 ? (
        <p className="text-ink-2" aria-live="off">
          Gửi lại mã sau{" "}
          <span className="font-semibold text-ink font-mono">{secondsLeft}</span>{" "}
          giây
        </p>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleResend}
          loading={isResending}
          disabled={disabled}
          className="text-brand font-medium hover:underline flex items-center gap-1.5"
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>Gửi lại mã xác thực</span>
        </Button>
      )}

      {/* Screen reader only status update */}
      <div className="sr-only" role="status" aria-live="polite">
        {secondsLeft === 0
          ? "Bạn có thể gửi lại mã xác thực ngay bây giờ."
          : `Mã xác thực đã được gửi. Bạn có thể yêu cầu gửi lại sau ${secondsLeft} giây.`}
      </div>
    </div>
  );
}
