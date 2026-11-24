"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OtpInput } from "@/components/ui/OtpInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { AuthStepper } from "@/components/auth/AuthStepper";
import { ResendCountdown } from "@/components/auth/ResendCountdown";
import { verifyOtp, resendOtp, register } from "@/api/auth";
import { maskEmail } from "@/lib/formatters";
import { ArrowLeft } from "lucide-react";
import type { RegisterRequest } from "@/types/auth";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  try {
    return sessionStorage.getItem("pending_verify_email") ?? "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

export function VerifyOtpForm() {
  const router = useRouter();
  const email = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<{
    type: "danger" | "warn" | "success" | "info";
    message: string;
    isNetwork?: boolean;
  } | null>(null);

  // If on client and no email or pending register data in sessionStorage, redirect to /register
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("pending_verify_email");
        const storedData = sessionStorage.getItem("pending_register_data");
        if (!stored || !storedData) {
          router.replace("/register");
        }
      } catch {
        router.replace("/register");
      }
    }
  }, [router]);

  const handleVerify = async (codeToVerify?: string) => {
    const finalCode = codeToVerify || code;
    if (finalCode.length !== 6 || isLoading || isLocked) return;

    setFeedback(null);
    setIsLoading(true);

    try {
      // 1. Xác thực mã OTP trước với backend
      const res = await verifyOtp({ email, otp: finalCode });

      if (!res.ok) {
        if (res.error.code === "OTP_ATTEMPTS_EXCEEDED") {
          setIsLocked(true);
          setCode("");
          setFeedback({
            type: "warn",
            message: res.error.message,
          });
          setIsLoading(false);
          return;
        }

        if (res.error.code === "OTP_EXPIRED") {
          setFeedback({
            type: "danger",
            message: res.error.message,
          });
          setIsLoading(false);
          return;
        }

        if (res.error.code === "NETWORK_ERROR") {
          setFeedback({
            type: "danger",
            message: res.error.message,
            isNetwork: true,
          });
          setIsLoading(false);
          return;
        }

        // Incorrect OTP: clear code, refocus first slot
        setCode("");
        setFeedback({
          type: "danger",
          message: res.error.message,
        });

        // Refocus first slot
        setTimeout(() => {
          document.getElementById("otp-input-slot-0")?.focus();
        }, 50);
        setIsLoading(false);
        return;
      }

      // 2. Khi auth/verify-otp thành công rồi mới lấy dữ liệu và gọi auth/register
      let pendingRegisterData: string | null = null;
      try {
        pendingRegisterData = sessionStorage.getItem("pending_register_data");
      } catch {
        // storage blocked
      }

      if (!pendingRegisterData) {
        setFeedback({
          type: "danger",
          message:
            "Không tìm thấy thông tin đăng ký. Vui lòng quay lại biểu mẫu đăng ký.",
        });
        setIsLoading(false);
        return;
      }

      setFeedback({
        type: "info",
        message: "Xác thực email thành công! Đang tiến hành tạo tài khoản...",
      });

      const registerPayload: RegisterRequest = JSON.parse(pendingRegisterData);
      const registerRes = await register(registerPayload);

      if (!registerRes.ok) {
        setFeedback({
          type: "danger",
          message:
            registerRes.error.message ||
            "Đăng ký tài khoản không thành công. Vui lòng thử lại.",
          isNetwork: registerRes.error.code === "NETWORK_ERROR",
        });
        setIsLoading(false);
        return;
      }

      // 3. Đăng ký thành công → dọn dẹp sessionStorage và chuyển sang Login
      try {
        sessionStorage.removeItem("pending_verify_email");
        sessionStorage.removeItem("pending_register_data");
      } catch {
        // ignore
      }

      setFeedback({
        type: "success",
        message: "Đăng ký thành công! Đang chuyển hướng sang trang Đăng nhập...",
      });

      setTimeout(() => {
        router.push("/login?registered=1");
      }, 1000);
    } catch {
      setFeedback({
        type: "danger",
        message: "Không thể kết nối tới máy chủ. Vui lòng thử lại.",
        isNetwork: true,
      });
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setFeedback({
      type: "info",
      message: "Đang tiến hành gửi lại mã xác thực...",
    });
    try {
      const res = await resendOtp({ email });
      if (res.ok) {
        setIsLocked(false);
        setCode("");
        setFeedback({
          type: "success",
          message: "Mã xác thực mới đã được gửi tới email của bạn.",
        });
        setTimeout(() => {
          document.getElementById("otp-input-slot-0")?.focus();
        }, 50);
      } else {
        setFeedback({
          type: "danger",
          message: res.error.message,
          isNetwork: res.error.code === "NETWORK_ERROR",
        });
      }
    } catch {
      setFeedback({
        type: "danger",
        message: "Lỗi kết nối khi gửi lại mã. Vui lòng thử lại.",
        isNetwork: true,
      });
    }
  };

  if (!email) {
    return null; // Brief flash before redirect
  }

  return (
    <div className="w-full space-y-5">
      <AuthStepper currentStep={2} />

      <div className="text-center space-y-1">
        <p className="text-sm text-ink-2">
          Chúng tôi đã gửi mã gồm 6 chữ số tới:
        </p>
        <p className="text-base font-semibold text-ink font-mono tracking-wide">
          {maskEmail(email)}
        </p>
        <p className="text-xs text-ink-3">
          Mã có hiệu lực trong vòng 5 phút
        </p>
      </div>

      {feedback && (
        <Alert variant={feedback.type}>
          <span>{feedback.message}</span>
          {feedback.isNetwork && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => handleVerify()}
                className="font-semibold underline hover:text-ink cursor-pointer"
              >
                Thử lại ngay
              </button>
            </div>
          )}
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="space-y-5"
      >
        <OtpInput
          id="otp-input"
          value={code}
          onChange={(val) => {
            setCode(val);
            if (feedback && feedback.type === "danger") setFeedback(null);
          }}
          onComplete={(completedCode) => handleVerify(completedCode)}
          disabled={isLoading || isLocked}
          error={Boolean(feedback && feedback.type === "danger")}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={code.length !== 6 || isLocked}
          loading={isLoading}
        >
          Xác nhận
        </Button>
      </form>

      <ResendCountdown onResend={handleResend} disabled={isLoading} />

      <div className="pt-2 text-center border-t border-line space-y-2">
        <Link
          href="/register"
          className="inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink underline"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Đổi địa chỉ email khác</span>
        </Link>
        <p className="text-[11px] text-ink-3">
          Không thấy email? Hãy kiểm tra thư mục rác (Spam / Junk) hoặc đợi hết thời gian để gửi lại.
        </p>
      </div>
    </div>
  );
}
