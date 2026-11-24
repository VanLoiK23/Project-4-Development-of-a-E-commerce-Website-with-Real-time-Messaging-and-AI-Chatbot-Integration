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
import type { AuthMode } from "@/types/auth";

interface LoginFormProps {
  /** Callback khi người dùng bấm chuyển sang Register (dùng trong split-card) */
  onSwitchMode?: (mode: AuthMode) => void;
}

/**
 * Client Component LoginForm.
 * Contract: POST /api/auth/login → { userNameOrEmail, password }
 * Response: LoginResponse { token: { accessToken, tokenType, expiresIn }, user: AccountResponse }
 * Errors handled: INVALID_CREDENTIALS, ACCOUNT_LOCKED, NETWORK_ERROR, EMAIL_UNVERIFIED.
 */
export function LoginForm({ onSwitchMode }: LoginFormProps) {
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

  const isVerified = searchParams.get("verified") === "1";
  const isRegistered = searchParams.get("registered") === "1" || isVerified;
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
      setServerError({ type: "danger", message: "Vui lòng nhập mật khẩu." });
      passwordInputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      // Gửi userNameOrEmail theo đúng field name của BE LoginRequest
      const res = await login({ userNameOrEmail: email, password });

      if (res.ok) {
        // BE trả về accessToken trong LoginResponse.token.accessToken
        // Lưu vào memory/cookie (không dùng localStorage theo AGENTS.md)
        const nextUrl = getSafeRedirectUrl(searchParams.get("next"), "/");
        router.push(nextUrl);
        return;
      }

      if (res.error.code === "EMAIL_UNVERIFIED") {
        try {
          sessionStorage.setItem(
            "pending_verify_email",
            email.trim().toLowerCase()
          );
        } catch {
          // sessionStorage blocked
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

      // INVALID_CREDENTIALS – xóa password, focus lại
      setServerError({ type: "danger", message: res.error.message });
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
    <div className="w-full space-y-5">
      {/* Heading (h1 ở page level, đây là sub-heading trong card) */}
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">
          Đăng nhập
        </h1>
        <p className="text-sm text-ink-2 mt-1">
          Chào mừng trở lại! Đăng nhập để tiếp tục trải nghiệm.
        </p>
      </div>

      {/* Phản hồi từ bước trước */}
      {isRegistered && (
        <Alert variant="success">
          Tài khoản đã được đăng ký và xác thực thành công. Hãy đăng nhập để tiếp tục.
        </Alert>
      )}

      {isReset && (
        <Alert variant="success">
          Mật khẩu đã được đặt lại thành công. Hãy đăng nhập bằng mật khẩu mới.
        </Alert>
      )}

      {/* Lỗi từ server */}
      {serverError && (
        <Alert variant={serverError.type}>
          <span>{serverError.message}</span>
          {serverError.isLocked && (
            <div className="mt-2">
              <Link
                href="/forgot-password"
                className="font-semibold underline hover:opacity-80"
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
                className="font-semibold underline hover:opacity-80 cursor-pointer"
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
          label="Email hoặc tên đăng nhập"
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
            ref={passwordInputRef}
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

      {/* Chuyển sang Register */}
      <div className="text-center pt-1 text-sm text-ink-2">
        Chưa có tài khoản?{" "}
        {onSwitchMode ? (
          <button
            type="button"
            onClick={() => onSwitchMode("register")}
            className="font-semibold text-ink underline hover:text-ink-2 cursor-pointer"
          >
            Đăng ký ngay
          </button>
        ) : (
          <Link
            href="/register"
            className="font-semibold text-ink underline hover:text-ink-2"
          >
            Đăng ký ngay
          </Link>
        )}
      </div>
    </div>
  );
}
