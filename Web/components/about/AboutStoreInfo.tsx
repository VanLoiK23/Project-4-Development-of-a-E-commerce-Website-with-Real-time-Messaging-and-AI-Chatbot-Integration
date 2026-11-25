import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface AboutStoreInfoProps {
  className?: string;
}

export function AboutStoreInfo({ className }: AboutStoreInfoProps) {
  return (
    <section aria-labelledby="store-info-heading" className={cn("py-12 sm:py-16", className)}>
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Store Contacts & Location */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                Thông tin liên hệ & Cửa hàng
              </span>
              <h2 id="store-info-heading" className="text-2xl sm:text-3xl font-bold text-ink">
                Trải nghiệm trực tiếp tại không gian Phone Store
              </h2>
              <p className="text-sm text-ink-2 leading-relaxed">
                Ngoài nền tảng trực tuyến, khách hàng có thể ghé thăm không gian trải nghiệm thực tế để cầm nắm thiết bị, kiểm tra hiệu năng và nhận tư vấn trực tiếp từ đội ngũ chuyên viên.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-sm text-ink-2">
              <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-lg)] bg-surface border border-line">
                <Icon icon={MapPin} size={20} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">Trụ sở chính & Showroom:</p>
                  <p className="text-xs sm:text-sm text-ink-2 mt-0.5">
                    Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-lg)] bg-surface border border-line">
                <Icon icon={Phone} size={20} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">Tổng đài hỗ trợ kỹ thuật & Mua hàng:</p>
                  <p className="text-xs sm:text-sm text-ink-2 mt-0.5">
                    1800 6868 (Miễn phí cước gọi từ 08:00 – 21:30)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-[var(--radius-lg)] bg-surface border border-line">
                <Icon icon={Clock} size={20} className="text-brand shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink">Thời gian hoạt động:</p>
                  <p className="text-xs sm:text-sm text-ink-2 mt-0.5">
                    Thứ Hai – Chủ Nhật: 08:00 – 21:30 (Kể cả ngày lễ)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CTA Box */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="p-6 sm:p-8 rounded-[var(--radius-xl)] bg-surface border border-line shadow-[var(--shadow-sm)] text-center space-y-5 flex-1 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-[var(--radius-full)] bg-surface-subtle text-brand flex items-center justify-center mx-auto border border-line">
                <Icon icon={ShieldCheck} size={24} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-ink">
                  Sẵn sàng tìm chiếc điện thoại hoàn hảo?
                </h3>
                <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                  Xem ngay bảng xếp hạng điểm ABSA hoặc trải nghiệm tính năng gợi ý cá nhân hóa dựa trên tiêu chí của bạn.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link href="/products" className="block">
                  <Button variant="primary" className="w-full justify-center h-11 font-semibold">
                    <span>Xem danh sách điện thoại</span>
                    <Icon icon={ArrowRight} size={16} />
                  </Button>
                </Link>
                <Link href="/contact" className="block">
                  <Button variant="secondary" className="w-full justify-center h-11 font-semibold">
                    <span>Gửi câu hỏi cho chúng tôi</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
