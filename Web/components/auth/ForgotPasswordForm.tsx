"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { ResendCountdown } from "@/components/auth/ResendCountdown";
import { requestPasswordReset } from "@/api/auth";
import { validateEmail } from "@/lib/validation";
import { ArrowLeft, MailCheck } from "lucide-react";

/**
 * Client Component ForgotPasswordForm.
 * Asks for user email. Once submitted, switches to an honest, generic confirmation notice
 * ("Nếu email này có tài khoản, chúng tôi đã gửi liên kết...") preventing user enumeration.
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsLoading(true);

    try {
      const res = await requestPasswordReset({ email });
      if (!res.ok) {
        setServerError(res.error.message);
        return;
      }
      setIsSubmitted(true);
    } catch {
      setServerError("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setServerError(null);
    try {
      await requestPasswordReset({ email });
    } catch {
      setServerError("Không thể gửi lại email lúc này. Vui lòng thử lại.");
    }
  };

  // State 2: Confirmation Notice
  if (isSubmitted) {
    return (
      <div className="w-full space-y-5 text-center">
        <div className="w-12 h-12 bg-success-soft text-success rounded-full flex items-center justify-center mx-auto">
          <MailCheck size={24} aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <p className="text-base font-semibold text-ink">
            Kiểm tra hộp thư của bạn
          </p>
          <p className="text-sm text-ink-2 leading-relaxed">
            Nếu email{" "}
            <strong className="text-ink font-medium">{email}</strong> có tài
            khoản trên hệ thống, chúng tôi đã gửi một liên kết đặt lại mật khẩu.
          </p>
          <p className="text-xs text-ink-3">
            Liên kết có hiệu lực trong vòng 30 phút.
          </p>
        </div>

        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <ResendCountdown onResend={handleResend} />

        <div className="pt-3 border-t border-line space-y-2 text-xs text-ink-3">
          <p>
            Không thấy email? Hãy kiểm tra hòm thư rác (Spam) hoặc tìm kiếm từ khóa
            &quot;Phone Store&quot;.
          </p>
          <div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-ink font-medium underline hover:text-ink-2"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span>Quay lại trang Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 1: Input Form
  return (
    <div className="w-full space-y-4">
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="forgot-email"
          name="email"
          type="email"
          label="Địa chỉ email đã đăng ký"
          placeholder="ten@domain.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          onBlur={() => setEmailError(validateEmail(email))}
          error={emailError}
          required
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={isLoading}
        >
          Gửi liên kết đặt lại mật khẩu
        </Button>
      </form>

      <div className="text-center pt-2 text-sm text-ink-2">
        Nhớ lại mật khẩu?{" "}
        <Link
          href="/login"
          className="font-semibold text-ink underline hover:text-ink-2"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
