"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Send, Sparkles } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface BlogNewsletterProps {
  className?: string;
}

export function BlogNewsletter({ className }: BlogNewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMsg("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className={cn(
        "relative rounded-[var(--radius-xl)] bg-surface border border-line p-6 sm:p-10 lg:p-12 shadow-[var(--shadow-sm)] text-center overflow-hidden",
        className
      )}
    >
      <div className="max-w-xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-surface-subtle border border-line text-xs font-semibold text-ink-2">
          <Icon icon={Sparkles} size={14} className="text-ai" />
          <span>Bản tin công nghệ Phone Store</span>
        </div>

        <h2 id="newsletter-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-ink">
          Đăng ký nhận phân tích công nghệ & gợi ý ABSA
        </h2>

        <p className="text-sm text-ink-2 leading-relaxed max-w-md mx-auto">
          Cập nhật các bài đánh giá khía cạnh phần cứng khách quan, xu hướng smartphone mới và ưu đãi thành viên hàng tuần.
        </p>

        {status === "success" ? (
          <div
            role="alert"
            className="flex items-center justify-center gap-2 p-4 rounded-[var(--radius-md)] bg-pos-soft border border-pos/30 text-pos text-sm font-medium animate-in fade-in"
          >
            <Icon icon={CheckCircle2} size={18} />
            <span>Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi những bài viết hữu ích nhất tới bạn.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <label htmlFor="newsletter-email-input" className="sr-only">
                Nhập email của bạn
              </label>
              <div className="relative flex items-center">
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Nhập địa chỉ email của bạn..."
                  className="w-full h-11 pl-10 pr-4 text-sm bg-canvas text-ink placeholder:text-ink-3 rounded-[var(--radius-md)] border border-line focus:border-brand focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] transition-colors"
                  disabled={status === "submitting"}
                />
                <span className="absolute left-3 text-ink-3 pointer-events-none">
                  <Icon icon={Mail} size={18} />
                </span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={status === "submitting"}
              className="w-full sm:w-auto h-11 px-6 shrink-0"
            >
              <span className="flex items-center gap-1.5">
                <span>{status === "submitting" ? "Đang gửi..." : "Đăng ký"}</span>
                <Icon icon={Send} size={16} />
              </span>
            </Button>
          </form>
        )}

        {status === "error" && (
          <p role="alert" className="text-xs text-danger font-medium mt-1">
            {errorMsg}
          </p>
        )}

        <p className="text-[11px] text-ink-3">
          Chúng tôi cam kết bảo mật thông tin và tôn trọng quyền riêng tư của bạn. Không spam.
        </p>
      </div>
    </section>
  );
}
