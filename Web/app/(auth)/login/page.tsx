import { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Đăng nhập tài khoản",
  description: "Đăng nhập tài khoản Phone Store để khám phá gợi ý smartphone cá nhân hóa và quản lý đơn hàng.",
  robots: {
    index: false,
    follow: false,
  },
};

function LoginLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthCard
      title="Đăng nhập"
      description="Chào mừng bạn quay lại! Đăng nhập để tiếp tục trải nghiệm."
    >
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
