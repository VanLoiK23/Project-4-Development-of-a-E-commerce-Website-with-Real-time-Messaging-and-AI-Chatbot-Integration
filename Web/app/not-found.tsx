import React from "react";
import Link from "next/link";
import { Search, Home, Smartphone } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <AppShell>
      <Container size="md" className="py-16 sm:py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-subtle text-ink-2 mb-6">
          <Icon icon={Search} size={32} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
          404 – Không tìm thấy trang
        </h1>
        <p className="text-base text-ink-2 max-w-md mx-auto mb-8">
          Trang bạn đang tìm kiếm có thể đã được chuyển đổi, xóa hoặc không tồn tại.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md" className="gap-2">
              <Icon icon={Home} size={18} />
              <span>Về trang chủ</span>
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="secondary" size="md" className="gap-2">
              <Icon icon={Smartphone} size={18} />
              <span>Xem tất cả điện thoại</span>
            </Button>
          </Link>
        </div>
      </Container>
    </AppShell>
  );
}
