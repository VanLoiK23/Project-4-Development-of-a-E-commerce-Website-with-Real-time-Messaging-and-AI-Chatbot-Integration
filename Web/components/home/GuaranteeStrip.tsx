import React from "react";
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "100% Chính hãng",
    desc: "Bảo hành tiêu chuẩn toàn quốc",
  },
  {
    icon: Truck,
    title: "Giao siêu tốc 2h",
    desc: "Miễn phí giao hàng đơn từ 500k",
  },
  {
    icon: RotateCcw,
    title: "Đổi mới 30 ngày",
    desc: "Nếu có lỗi do nhà sản xuất",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 24/7",
    desc: "Đội ngũ kỹ thuật viên tận tình",
  },
];

/**
 * Service Guarantees Strip conforming to page-design-guidelines.md S1.
 * Hover: thẻ nổi nhẹ + icon xoay 360° (tôn trọng prefers-reduced-motion toàn cục).
 */
export function GuaranteeStrip({ className }: { className?: string }) {
  return (
    <section className={cn("py-3 bg-surface border-y border-line", className)}>
      {/* Keyframe spin-once cho icon – CSS-in-JSX thay vì dependency mới */}
      <style>{`
        @keyframes icon-spin-once {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .guarantee-icon-wrap:hover .guarantee-icon {
            animation: icon-spin-once 0.65s cubic-bezier(0.4,0,0.2,1) forwards;
          }
        }
      `}</style>

      <Container size="xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {GUARANTEES.map((item, idx) => (
            <div
              key={idx}
              className="guarantee-icon-wrap flex items-center gap-3 p-3 rounded-xl bg-surface-subtle/30 border border-transparent transition-all duration-200 hover:bg-surface hover:border-line hover:shadow-sm hover:-translate-y-0.5 group cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-brand text-ink-inverse flex items-center justify-center shrink-0 transition-colors duration-200 group-hover:bg-brand-hover">
                <span className="guarantee-icon">
                  <Icon icon={item.icon} size={20} />
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-ink truncate transition-colors duration-200 group-hover:text-brand-hover">
                  {item.title}
                </h4>
                <p className="text-[11px] text-ink-3 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
