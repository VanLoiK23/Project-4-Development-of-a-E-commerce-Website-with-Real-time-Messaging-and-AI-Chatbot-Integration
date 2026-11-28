import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Compass } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface AboutHeroProps {
  className?: string;
}

export function AboutHero({ className }: AboutHeroProps) {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className={cn(
        "relative py-12 sm:py-16 lg:py-24 bg-surface border-b border-line overflow-hidden",
        className
      )}
    >
      <Container size="xl">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-surface-subtle border border-line text-xs font-semibold text-ink-2 shadow-[var(--shadow-sm)]">
            <Icon icon={Sparkles} size={14} className="text-ai" />
            <span>Nền tảng mua sắm smartphone thế hệ mới</span>
          </div>

          <h1
            id="about-hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink font-heading leading-tight"
          >
            Chuẩn mực mới trong lựa chọn smartphone thông minh
          </h1>

          <p className="text-base sm:text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto">
            Chúng tôi xóa bỏ rào cản giữa thông số quảng cáo và thực tế sử dụng. Với công nghệ phân tích cảm xúc đa khía cạnh (ABSA) và gợi ý cá nhân hóa, bạn luôn tìm được chiếc máy đúng nhu cầu thực tế.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/products">
              <Button variant="primary" className="w-full sm:w-auto h-11 px-6 font-semibold">
                <span>Khám phá sản phẩm</span>
                <Icon icon={ArrowRight} size={16} />
              </Button>
            </Link>
            <Link href="/recommendation">
              <Button variant="secondary" className="w-full sm:w-auto h-11 px-6 font-semibold">
                <Icon icon={Compass} size={16} />
                <span>Trải nghiệm Gợi ý AI</span>
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
