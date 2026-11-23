import Link from "next/link";
import { Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-canvas text-ink px-4 py-16">
      <main className="w-full max-w-lg p-8 bg-surface rounded-lg border border-line shadow-sm text-center space-y-6">
        <div className="w-12 h-12 bg-brand text-ink-inverse rounded-lg flex items-center justify-center mx-auto">
          <Smartphone size={24} aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Phone Store
          </h1>
          <p className="text-sm text-ink-2 leading-relaxed">
            Hệ thống bán lẻ điện thoại thông minh tích hợp gợi ý cá nhân hóa và phân tích cảm xúc đa khía cạnh (ABSA).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full justify-center gap-1.5">
              <span>Đăng nhập</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full justify-center">
              <span>Đăng ký tài khoản</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
