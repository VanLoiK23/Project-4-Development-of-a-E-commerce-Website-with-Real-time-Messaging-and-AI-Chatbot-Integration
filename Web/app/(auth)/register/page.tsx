import { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Skeleton } from "@/components/ui/Skeleton";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Tạo tài khoản Phone Store để nhận gợi ý sản phẩm phù hợp theo nhu cầu và tham gia cộng đồng đánh giá.",
  robots: {
    index: false,
    follow: false,
  },
};

function RegisterLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthCard
      title="Tạo tài khoản mới"
      description="Khởi tạo tài khoản chỉ trong 2 bước để đồng bộ sở thích cá nhân."
    >
      <Suspense fallback={<RegisterLoading />}>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
