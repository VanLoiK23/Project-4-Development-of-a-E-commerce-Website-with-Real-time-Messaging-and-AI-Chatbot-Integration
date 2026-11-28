"use client";

import React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { useConsent } from "@/hooks/use-consent";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Tracking Consent Notice conforming to component-guidelines.md §4.9.
 * Non-blocking bottom banner appearing on first visit.
 * Stores decision in localStorage without tracking before consent.
 */
export function ConsentBanner() {
  const { hasAnswered, acceptConsent, declineConsent } = useConsent();

  // Do not render if already answered or during SSR (status defaults to "accepted" on server)
  if (hasAnswered) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Thông báo quyền riêng tư và theo dõi"
      className="fixed bottom-16 lg:bottom-4 left-4 right-4 max-w-2xl mx-auto z-[1200] bg-surface/98 backdrop-blur-md border border-line rounded-xl shadow-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1">
          <div className="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-brand shrink-0 mt-0.5">
            <Icon icon={Shield} size={16} />
          </div>
          <div className="text-xs text-ink-2 space-y-0.5 leading-relaxed">
            <p>
              <strong className="text-ink">Bảo vệ quyền riêng tư:</strong> Chúng tôi dùng lịch sử xem sản phẩm để gợi ý máy phù hợp với bạn.
            </p>
            <Link
              href="/policies/privacy"
              className="text-xs font-medium text-ink underline-offset-4 hover:underline"
            >
              Tìm hiểu thêm chính sách
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={declineConsent}
            className="text-xs text-ink-3 hover:text-ink"
          >
            Không, cảm ơn
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={acceptConsent}
            className="text-xs font-semibold px-4"
          >
            Đồng ý
          </Button>
        </div>
      </div>
    </div>
  );
}
