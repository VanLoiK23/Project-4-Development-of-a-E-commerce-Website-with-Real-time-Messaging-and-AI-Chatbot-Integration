import { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Xác thực email",
  description: "Nhập mã xác thực 6 chữ số gửi tới email để hoàn tất kích hoạt tài khoản Phone Store.",
  robots: {
    index: false,
    follow: false,
  },
};

function VerifyOtpLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-13 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <AuthCard
      title="Xác thực email"
      description="Bước cuối cùng để hoàn tất đăng ký và bảo vệ tài khoản của bạn."
    >
      <Suspense fallback={<VerifyOtpLoading />}>
        <VerifyOtpForm />
      </Suspense>
    </AuthCard>
  );
}
