"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@/components/ui/TextField";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { login } from "@/api/auth";
import { getSafeRedirectUrl } from "@/lib/safe-redirect";
import { validateEmail } from "@/lib/validation";

/**
 * Client Component LoginForm.
 * Handles login credentials, account lock states, unverified redirect, and safe post-login redirection.
 */
export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<{
    type: "danger" | "warn";
    message: string;
    isLocked?: boolean;
    isNetwork?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Check URL query parameters for success feedback
  const isVerified = searchParams.get("verified") === "1";
  const isReset = searchParams.get("reset") === "1";

  const handleBlurEmail = () => {
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    if (!password) {
      setServerError({
        type: "danger",
        message: "Vui lòng nhập mật khẩu.",
      });
      passwordInputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const res = await login({ email, password });

      if (res.ok) {
        const nextUrl = getSafeRedirectUrl(searchParams.get("next"), "/");
        router.push(nextUrl);
        return;
      }

      // Handle specific error codes
      if (res.error.code === "EMAIL_UNVERIFIED") {
        try {
          sessionStorage.setItem("pending_verify_email", email.trim().toLowerCase());
        } catch {
          // sessionStorage blocked fallback
        }
        router.push("/register/verify");
        return;
      }

      if (res.error.code === "ACCOUNT_LOCKED") {
        setServerError({
          type: "warn",
          message: res.error.message,
          isLocked: true,
        });
        return;
      }

      if (res.error.code === "NETWORK_ERROR") {
        setServerError({
          type: "danger",
          message: res.error.message,
          isNetwork: true,
        });
        return;
      }

      // Generic invalid credentials: keep email, clear password, focus password
      setServerError({
        type: "danger",
        message: res.error.message,
      });
      setPassword("");
      setTimeout(() => {
        const el = document.getElementById("login-password") as HTMLInputElement;
        el?.focus();
      }, 50);
    } catch {
      setServerError({
        type: "danger",
        message: "Đã xảy ra sự cố không mong muốn. Vui lòng thử lại.",
        isNetwork: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Success banner from previous step */}
      {isVerified && (
        <Alert variant="success">
          Tài khoản đã được xác thực thành công. Hãy đăng nhập để tiếp tục.
        </Alert>
      )}

      {isReset && (
        <Alert variant="success">
          Mật khẩu đã được đặt lại thành công. Hãy đăng nhập bằng mật khẩu mới.
        </Alert>
      )}

      {/* Server feedback */}
      {serverError && (
        <Alert variant={serverError.type}>
          <span>{serverError.message}</span>
          {serverError.isLocked && (
            <div className="mt-2">
              <Link
                href="/forgot-password"
                className="font-semibold underline hover:text-ink"
              >
                Đặt lại mật khẩu ngay →
              </Link>
            </div>
          )}
          {serverError.isNetwork && (
            <div className="mt-2">
              <button
                type="button"
                onClick={handleSubmit}
                className="font-semibold underline hover:text-ink cursor-pointer"
              >
                Thử lại ngay
              </button>
            </div>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="login-email"
          name="email"
          type="email"
          label="Địa chỉ email"
          placeholder="ten@domain.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          onBlur={handleBlurEmail}
          error={emailError}
          required
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          disabled={isLoading}
        />

        <div className="space-y-1">
          <PasswordField
            id="login-password"
            name="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu của bạn"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-ink-2 hover:text-ink hover:underline focus-visible:outline-brand focus-visible:outline-2 rounded"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={isLoading}
        >
          Đăng nhập
        </Button>
      </form>

      <SocialLoginButtons />

      <div className="text-center pt-2 text-sm text-ink-2">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="font-semibold text-ink underline hover:text-ink-2"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
