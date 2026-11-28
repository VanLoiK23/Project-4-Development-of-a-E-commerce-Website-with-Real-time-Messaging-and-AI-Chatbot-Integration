import React from "react";
import { MessageSquareText, Layers, Award, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: "01",
    title: "Đọc đánh giá thật",
    desc: "Thu thập và xác thực hàng nghìn bình luận, đánh giá từ khách hàng đã thực sự sở hữu và sử dụng máy.",
    icon: MessageSquareText,
  },
  {
    step: "02",
    title: "Tách theo từng khía cạnh",
    desc: "Mô hình AI phân tách cảm xúc chi tiết theo thời lượng pin, độ nét camera, nhiệt độ tản nhiệt và màn hình.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Xếp hạng theo điều bạn quan tâm",
    desc: "Đề xuất chính xác chiếc điện thoại đạt điểm ABSA cao nhất ở đúng khía cạnh mà bạn ưu tiên.",
    icon: Award,
  },
];

/**
 * ABSA Explainer Section conforming to page-design-guidelines.md S1.
 * Explains how customer review data is processed with full transparency and honesty.
 */
export function AbsaExplainerSection({ className }: { className?: string }) {
  return (
    <section className={cn("py-4", className)}>
      <Container size="xl" className="space-y-1 p-5 bg-white rounded-2xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle text-xs font-semibold text-ink-2 border border-line">
            <Icon icon={Sparkles} size={13} className="text-ai" />
            <span>Minh bạch & Khoa học</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Cách chúng tôi phân tích đánh giá
          </h2>
          <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
            Điểm số không dựa trên quảng cáo hay cảm tính, mà là kết quả tổng hợp có trọng số từ dữ liệu trải nghiệm thực tế.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="relative flex flex-col p-6 bg-surface border border-line rounded-xl shadow-xs space-y-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-brand/30 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-surface-subtle flex items-center justify-center text-brand border border-line/60 transition-colors duration-200 group-hover:bg-brand group-hover:text-ink-inverse group-hover:border-brand">
                  <Icon icon={step.icon} size={22} />
                </div>
                <span className="text-2xl font-bold text-ink-3/40 tracking-wider transition-colors duration-200 group-hover:text-ink-3/60">
                  {step.step}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-ink transition-colors duration-200 group-hover:text-brand-hover">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
