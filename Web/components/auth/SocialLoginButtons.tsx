"use client";

import React, { useState } from "react";
import { GoogleIcon } from "@/components/ui/icons/GoogleIcon";
import { Button } from "@/components/ui/Button";
import { loginWithSocial } from "@/api/auth";
import { getSafeRedirectUrl } from "@/lib/safe-redirect";
import { useRouter, useSearchParams } from "next/navigation";

interface SocialLoginButtonsProps {
  termsNotice?: boolean;
}

/**
 * Client Component SocialLoginButtons.
 * Features single-color currentColor Google login.
 * Skips OTP if used during registration since email is pre-verified by provider.
 */
export function SocialLoginButtons({ termsNotice = false }: SocialLoginButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await loginWithSocial("google");
      if (res.ok) {
        const nextUrl = getSafeRedirectUrl(searchParams.get("next"), "/");
        router.push(nextUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <div className="relative px-3 bg-surface text-xs text-ink-3 uppercase tracking-wider font-medium">
          Hoặc tiếp tục với
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full justify-center gap-2.5 font-normal text-ink"
        onClick={handleGoogleLogin}
        loading={isLoading}
      >
        <GoogleIcon size={18} />
        <span>Đăng nhập với Google</span>
      </Button>

      {termsNotice && (
        <p className="text-[11px] text-ink-3 text-center leading-normal mt-2">
          Bằng việc đăng nhập với Google, bạn đồng ý với{" "}
          <a href="/policies/terms" className="text-ink underline hover:text-ink-2">
            Điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a href="/policies/privacy" className="text-ink underline hover:text-ink-2">
            Chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </p>
      )}
    </div>
  );
}
