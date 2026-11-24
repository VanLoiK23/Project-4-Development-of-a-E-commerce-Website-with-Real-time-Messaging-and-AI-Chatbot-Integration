import { Metadata } from "next";
import { Suspense } from "react";
import { AuthSplitPage } from "@/components/auth/AuthSplitPage";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Đăng nhập tài khoản",
  description:
    "Đăng nhập tài khoản Phone Store để khám phá gợi ý smartphone cá nhân hóa và quản lý đơn hàng.",
  robots: { index: false, follow: false },
};

function LoginSkeleton() {
  return (
    <div className="w-full max-w-[920px] mx-auto flex overflow-hidden rounded-xl border border-line bg-surface" style={{ minHeight: "560px" }}>
      <div className="hidden lg:block w-1/2 bg-brand" />
      <div className="w-full lg:w-1/2 p-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <AuthSplitPage initialMode="login" />
    </Suspense>
  );
}
