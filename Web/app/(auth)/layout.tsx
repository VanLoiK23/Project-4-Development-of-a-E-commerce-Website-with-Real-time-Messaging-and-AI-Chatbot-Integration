import React from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      {/* Minimal Header */}
      <header className="w-full border-b border-line bg-surface py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-ink hover:text-ink-2 transition-colors focus-visible:outline-brand focus-visible:outline-2 rounded"
          >
            <div className="w-8 h-8 rounded-md bg-brand text-ink-inverse flex items-center justify-center">
              <Smartphone size={18} aria-hidden="true" />
            </div>
            <span>Phone Store</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-2 hover:text-ink hover:underline focus-visible:outline-brand focus-visible:outline-2 rounded"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </header>

      {/* Main Centered Content (S10/S11 split-card wide, S12 compact) */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[960px] my-auto">
          {children}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-line py-4 px-4 text-center text-xs text-ink-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Phone Store. Tất cả các quyền được bảo lưu.</p>
          <div className="flex gap-4">
            <Link href="/policies/terms" className="hover:text-ink underline">
              Điều khoản
            </Link>
            <Link href="/policies/privacy" className="hover:text-ink underline">
              Bảo mật
            </Link>
            <Link href="/about" className="hover:text-ink underline">
              Giới thiệu
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
