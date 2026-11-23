import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { verifyResetToken } from "@/api/auth";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Tạo mật khẩu mới cho tài khoản Phone Store của bạn.",
  robots: {
    index: false,
    follow: false,
  },
  referrer: "no-referrer",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

function ResetPasswordLoading() {
  return (
    <AuthCard
      title="Đặt lại mật khẩu mới"
      description="Đang xác thực liên kết bảo mật..."
    >
      <div className="space-y-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </AuthCard>
  );
}

async function ResetPasswordContent({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  // Verify token securely on Server before rendering form
  const res = await verifyResetToken(token);

  if (!res.ok) {
    return (
      <AuthCard
        title="Liên kết không hợp lệ"
        description="Chúng tôi không thể xác thực yêu cầu đặt lại mật khẩu này."
      >
        <div className="space-y-5 text-center">
          <Alert variant="danger">
            Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn (hiệu lực tối đa 30 phút).
          </Alert>
          <div className="pt-2">
            <Link href="/forgot-password" className="block w-full">
              <Button variant="primary" className="w-full">
                Yêu cầu liên kết mới
              </Button>
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Đặt lại mật khẩu mới"
      description="Hãy tạo mật khẩu an toàn mới cho tài khoản của bạn."
    >
      <ResetPasswordForm token={token as string} />
    </AuthCard>
  );
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}
