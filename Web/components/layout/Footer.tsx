import React from "react";
import Link from "next/link";
import {
  Smartphone,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Lock,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = 2026;

  return (
    <footer
      role="contentinfo"
      className={cn(
        "w-full bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] border-t border-[var(--color-brand-hover)] mt-auto pb-16 lg:pb-0",
        className
      )}
    >
      {/* Value Proposition Highlights Banner */}
      <div className="border-b border-[var(--color-brand-hover)] py-8 bg-[var(--color-brand-primary)]">
        <Container size="xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] text-[var(--color-text-inverse)] shrink-0">
                <Icon icon={Sparkles} size={20} className="text-[var(--color-brand-accent)]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-text-inverse)]">
                  Gợi ý AI & ABSA khách quan
                </h2>
                <p className="text-xs text-[var(--color-text-subtle)] mt-0.5 leading-relaxed">
                  Phân tích đánh giá thực tế của cộng đồng theo từng khía cạnh phần cứng.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] text-[var(--color-text-inverse)] shrink-0">
                <Icon icon={ShieldCheck} size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-text-inverse)]">
                  Chính hãng 100%
                </h2>
                <p className="text-xs text-[var(--color-text-subtle)] mt-0.5 leading-relaxed">
                  Máy nguyên seal, nguồn gốc rõ ràng, bảo hành chính hãng toàn quốc.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] text-[var(--color-text-inverse)] shrink-0">
                <Icon icon={Truck} size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-text-inverse)]">
                  Giao nhanh toàn quốc
                </h2>
                <p className="text-xs text-[var(--color-text-subtle)] mt-0.5 leading-relaxed">
                  Đóng gói cẩn thận, bảo hiểm rơi vỡ, hỗ trợ kiểm tra trước khi nhận.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] text-[var(--color-text-inverse)] shrink-0">
                <Icon icon={RotateCcw} size={20} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-text-inverse)]">
                  Đổi trả 30 ngày
                </h2>
                <p className="text-xs text-[var(--color-text-subtle)] mt-0.5 leading-relaxed">
                  Lỗi 1 đổi 1 nhanh chóng nếu phát sinh lỗi phần cứng từ nhà sản xuất.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Links & Info Grid */}
      <div className="py-12 lg:py-16">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Col 1: Brand Info & ABSA statement */}
            <div className="lg:col-span-2 space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-bold text-xl text-[var(--color-text-inverse)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                aria-label="Phone Store - Trang chủ"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] border border-[var(--color-border-default)]/20 text-[var(--color-text-inverse)]">
                  <Icon icon={Smartphone} size={18} />
                </span>
                <span className="font-heading">
                  Phone<span className="text-[var(--color-brand-accent)]">Store</span>
                </span>
              </Link>

              <p className="text-sm text-[var(--color-text-subtle)] leading-relaxed max-w-sm">
                Nền tảng mua sắm smartphone hiện đại dành cho người Việt. Kết hợp phân tích cảm xúc đánh giá đa khía cạnh (ABSA) và gợi ý cá nhân hóa dựa trên hành vi thực tế.
              </p>

              <div className="pt-2 space-y-2.5 text-xs text-[var(--color-text-subtle)]">
                <div className="flex items-center gap-2.5">
                  <Icon icon={MapPin} size={16} className="text-[var(--color-text-muted)]" />
                  <span>Khu phố 6, Phường Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon icon={Phone} size={16} className="text-[var(--color-text-muted)]" />
                  <span>Hotline: 1800 6868 (Miễn phí 8:00 - 21:30)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Icon icon={Mail} size={16} className="text-[var(--color-text-muted)]" />
                  <span>Email: lienhe@phonestore.vn</span>
                </div>
              </div>
            </div>

            {/* Col 2: Danh mục & Khám phá */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-inverse)] uppercase tracking-wider mb-4">
                Khám phá
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/products"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Tất cả điện thoại
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recommendation"
                    className="inline-flex items-center gap-1.5 text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    <Icon icon={Sparkles} size={13} className="text-[var(--color-brand-accent)]" />
                    <span>Gợi ý theo nhu cầu AI</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compare"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    So sánh thông số & ABSA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?filter=flagship"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Smartphone cao cấp
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?filter=tam-trung"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Phổ thông & Tầm trung
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Hỗ trợ & Chính sách */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-inverse)] uppercase tracking-wider mb-4">
                Chính sách & Hỗ trợ
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/policies/bao-hanh"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Chính sách bảo hành
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/doi-tra"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Chính sách đổi trả & hoàn tiền
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/van-chuyen"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Giao hàng & Vận chuyển
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/thanh-toan"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Phương thức thanh toán
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/quyen-rieng-tu"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Quyền riêng tư & Thu thập dữ liệu
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Thông tin & Bài viết */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-text-inverse)] uppercase tracking-wider mb-4">
                Về Phone Store
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Giới thiệu & Công nghệ ABSA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Tin tức & Đánh giá máy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Liên hệ & Góp ý
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/preferences"
                    className="text-[var(--color-text-subtle)] hover:text-[var(--color-text-inverse)] hover:underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                  >
                    Quản lý dữ liệu cá nhân hóa
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="border-t border-[var(--color-brand-hover)] py-6 bg-[var(--color-brand-dark)] text-xs text-[var(--color-text-subtle)]">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p>
                © {currentYear} Phone Store. Bản quyền thuộc về Đồ án Chuyên ngành 2 – Nền tảng E-commerce & Trợ lý thông minh.
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                Điểm đánh giá ABSA được tổng hợp tự động từ phản hồi người dùng thực tế theo từng khía cạnh phần cứng.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                <Icon icon={Lock} size={14} />
                <span>Bảo mật giao dịch</span>
              </span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
