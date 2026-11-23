import { Metadata } from "next";
import { Suspense } from "react";
import { AuthSplitPage } from "@/components/auth/AuthSplitPage";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description:
    "Tạo tài khoản Phone Store để nhận gợi ý sản phẩm phù hợp theo nhu cầu và tham gia cộng đồng đánh giá.",
  robots: { index: false, follow: false },
};

function RegisterSkeleton() {
  return (
    <div className="w-full max-w-[920px] mx-auto flex overflow-hidden rounded-xl border border-line bg-surface" style={{ minHeight: "560px" }}>
      <div className="hidden lg:block w-1/2 bg-brand" />
      <div className="w-full lg:w-1/2 p-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-6 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterSkeleton />}>
      <AuthSplitPage initialMode="register" />
    </Suspense>
  );
}
