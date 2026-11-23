import React from "react";
import { cn } from "@/lib/utils";

interface SimpleAuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SimpleAuthCard – dùng cho các trang đơn giản: Quên mật khẩu, Đặt lại mật khẩu,
 * Xác thực OTP. Không có split layout, không có animation mode.
 * Centered white card với border-line và radius-lg.
 */
export function SimpleAuthCard({
  title,
  description,
  children,
  className,
}: SimpleAuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[440px] bg-surface rounded-xl border border-line p-6 sm:p-8",
        "shadow-[0_2px_12px_-2px_color-mix(in_srgb,var(--color-brand-primary)_12%,transparent)]",
        "text-left mx-auto",
        className
      )}
    >
      <div className="mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-ink-2 mt-2 leading-relaxed">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
