import React from "react";
import Link from "next/link";
import {
  Smartphone,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";

export interface FooterProps {
  className?: string;
}

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Danh mục & Khám phá",
    links: [
      { label: "Tất cả điện thoại", href: "/products" },
      { label: "Gợi ý AI theo nhu cầu", href: "/recommendation" },
      { label: "So sánh điện thoại & ABSA", href: "/compare" },
      { label: "Top đánh giá ABSA cao nhất", href: "/products?sort=absa_desc" },
      { label: "Smartphone Flagship", href: "/products?category=flagship" },
      { label: "Smartphone Tầm trung", href: "/products?category=tam-trung" },
    ],
  },
  {
    title: "Hỗ trợ & Chính sách",
    links: [
      { label: "Chính sách bảo hành chính hãng", href: "/policies/warranty" },
      { label: "Chính sách đổi trả 30 ngày", href: "/policies/return" },
      { label: "Vận chuyển & Giao hàng 2h", href: "/policies/shipping" },
      { label: "Quyền riêng tư & Thu thập dữ liệu", href: "/policies/privacy" },
      { label: "Liên hệ & Góp ý", href: "/contact" },
      { label: "Về công nghệ ABSA & AI", href: "/about" },
    ],
  },
  {
    title: "Nội dung & Tiện ích",
    links: [
      { label: "Tin công nghệ & Đánh giá", href: "/blog" },
      { label: "Cẩm nang chọn mua smartphone", href: "/blog/huong-dan-chon-smartphone" },
      { label: "Tra cứu tình trạng đơn hàng", href: "/account/orders" },
      { label: "Quản lý sở thích & Gợi ý AI", href: "/account/preferences" },
    ],
  },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className={cn(
        "bg-brand text-ink-inverse on-dark border-t border-brand-hover pb-20 lg:pb-10 transition-colors",
        className
      )}
    >

      {/* Main Footer Links & Information */}
      <div className="py-10 sm:py-12">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Col 1: Brand Info & ABSA Disclosure (Span 4 cols on desktop) */}
            <div className="lg:col-span-4 space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 group rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Phone Store - Trang chủ"
              >
                <div className="w-9 h-9 rounded-md bg-brand-hover border border-white/10 flex items-center justify-center text-ink-inverse group-hover:border-white/30 transition-colors">
                  <Icon icon={Smartphone} size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tight text-ink-inverse leading-none">
                    PHONE<span className="text-ai font-extrabold ml-0.5">STORE</span>
                  </span>
                </div>
              </Link>

              <p className="text-xs text-white/70 leading-relaxed max-w-sm">
                Nền tảng thương mại điện tử chuyên biệt smartphone. Chúng tôi giúp bạn chọn đúng chiếc máy lý tưởng thông qua công nghệ phân tích cảm xúc đa khía cạnh (ABSA) và gợi ý cá nhân hóa thông minh.
              </p>

              {/* ABSA Aspect Transparency Disclosure */}
              <div className="p-3 rounded-lg bg-brand-hover/60 border border-white/10 space-y-1.5 max-w-sm">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                  <Icon icon={CheckCircle2} size={15} className="text-ai" />
                  <span>Minh bạch đánh giá ABSA</span>
                </div>
                <p className="text-[11px] text-white/60 leading-normal">
                  Chấm điểm độc lập các khía cạnh: Pin, Camera, Hiệu năng, Màn hình, Thiết kế,..từ hàng nghìn phản hồi của người mua thật.
                </p>
              </div>

              {/* Direct Contact Details */}
              <div className="space-y-2 text-xs text-white/70 pt-1">
                <div className="flex items-center gap-2">
                  <Icon icon={Phone} size={14} className="text-white/50 shrink-0" />
                  <span>
                    Hotline:{" "}
                    <a
                      href="tel:18006868"
                      className="text-ink-inverse font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-xs"
                    >
                      1800 6868
                    </a>{" "}
                    (8:00 – 21:30, Miễn phí)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Icon icon={Mail} size={14} className="text-white/50 shrink-0" />
                  <span>
                    Email:{" "}
                    <a
                      href="mailto:loihv.23ite@vku.udn.vn"
                      className="text-ink-inverse font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-xs"
                    >
                      loihv.23ite@vku.udn.vn
                    </a>
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Icon icon={MapPin} size={14} className="text-white/50 mt-0.5 shrink-0" />
                  <span>
                    Trụ sở:{" "}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=23+Tr%E1%BA%A7n+Cao+V%C3%A2n%2C+%C4%90%C3%A0+N%E1%BA%B5ng"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-inverse hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-xs"
                    >
                      23 Trần Cao Vân, Đà Nẵng
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Col 2, 3, 4: Link Groups */}
            {FOOTER_COLUMNS.map((col, index) => {
              // Distribute columns evenly across 8 remaining desktop columns (3 + 3 + 2)
              const colSpanClass = index === 2 ? "lg:col-span-2" : "lg:col-span-3";

              return (
                <div key={col.title} className={colSpanClass}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-inverse mb-3.5 pb-1 border-b border-white/10 inline-block">
                    {col.title}
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-white/70 hover:text-ink-inverse hover:underline transition-colors duration-150 inline-flex items-center gap-1 py-1 rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          <span>{link.label}</span>
                          {link.isExternal && (
                            <Icon icon={ArrowUpRight} size={12} className="text-white/40" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Container>
      </div>

      {/* Bottom Bar: Copyright & ABSA/AI Legal Notes */}
      <div className="border-t border-brand-hover/70 pt-6 mt-2">
        <Container size="xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-xs text-white/60 text-center md:text-left">
            <p>
              © 2026 Phone Store. Bản quyền thuộc về Phone Store – Nền tảng bán lẻ smartphone thông minh.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
