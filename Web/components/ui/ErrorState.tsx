import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Đã có lỗi xảy ra",
  message = "Không thể tải dữ liệu vào lúc này. Vui lòng thử lại.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 bg-surface rounded-xl border border-line",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-danger-soft text-danger flex items-center justify-center mb-4">
        <Icon icon={AlertTriangle} size={24} />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-2 max-w-md mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="gap-2">
          <Icon icon={RefreshCw} size={15} />
          <span>Thử lại</span>
        </Button>
      )}
    </div>
  );
}
