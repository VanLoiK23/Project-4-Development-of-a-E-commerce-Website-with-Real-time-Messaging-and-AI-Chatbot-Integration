import { Metadata } from "next";
import { Suspense } from "react";
import { SimpleAuthCard } from "@/components/auth/SimpleAuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { DevHint } from "@/components/auth/DevHint";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description:
    "Yêu cầu liên kết đặt lại mật khẩu an toàn cho tài khoản Phone Store.",
  robots: { index: false, follow: false },
};

function ForgotPasswordLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[440px] mx-auto space-y-4">
      <SimpleAuthCard
        title="Quên mật khẩu"
        description="Nhập địa chỉ email đăng ký để nhận liên kết đặt lại mật khẩu an toàn."
      >
        <Suspense fallback={<ForgotPasswordLoading />}>
          <ForgotPasswordForm />
        </Suspense>
      </SimpleAuthCard>
      <DevHint />
    </div>
  );
}
