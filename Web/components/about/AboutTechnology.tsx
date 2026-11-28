import React from "react";
import {
  BarChart3,
  ShieldCheck,
  Brain,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface AboutTechnologyProps {
  className?: string;
}

export function AboutTechnology({ className }: AboutTechnologyProps) {
  return (
    <section
      aria-labelledby="about-tech-heading"
      className={cn("py-12 sm:py-16 bg-surface-subtle/60 border-y border-line", className)}
    >
      <Container size="xl" className="space-y-12">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
            Công nghệ cốt lõi
          </span>
          <h2 id="about-tech-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink">
            Hai trụ cột tạo nên sự khác biệt
          </h2>
          <p className="text-sm text-ink-2 leading-relaxed">
            Sự phối hợp chặt chẽ giữa dữ liệu cảm xúc cộng đồng và mô hình học máy cá nhân hóa, mang lại trải nghiệm mua sắm thông minh và trung thực.
          </p>
        </div>

        {/* 2 Main Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Pillar 1: ABSA */}
          <div className="flex flex-col justify-between h-full p-6 sm:p-8 rounded-[var(--radius-xl)] bg-surface border border-line shadow-[var(--shadow-sm)] space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-[var(--radius-lg)] bg-surface-subtle text-brand border border-line">
                  <Icon icon={BarChart3} size={24} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-[var(--radius-full)] bg-surface-subtle text-ink-2 border border-line">
                  Trụ cột 01
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-ink">
                  Phân tích cảm xúc theo khía cạnh (ABSA)
                </h3>
                <p className="text-sm text-ink-2 leading-relaxed">
                  Thay vì tính điểm trung bình chung chung (3 sao hay 5 sao), mô hình ABSA bóc tách từng nhận xét thành các khía cạnh phần cứng cụ thể:
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-ink-2 pt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <span><strong>Pin & Sạc:</strong> Thời lượng sử dụng thực tế, nhiệt độ sạc, tốc độ đầy pin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <span><strong>Camera:</strong> Ảnh chân dung, quay video đêm, chống rung OIS, zoom xa.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <span><strong>Hiệu năng & Tản nhiệt:</strong> Tốc độ mở ứng dụng, độ mượt khi chơi game, khả năng kiểm soát nhiệt độ.</span>
                </li>
              </ul>
            </div>

            {/* Threshold explanation */}
            <div className="p-4 rounded-[var(--radius-lg)] bg-surface-subtle border border-line text-xs space-y-2">
              <p className="font-semibold text-ink">Ngưỡng chấm điểm chuẩn hóa:</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-[var(--radius-sm)] bg-pos-soft text-pos font-semibold">
                  ≥ 4.0: Tích cực
                </div>
                <div className="p-2 rounded-[var(--radius-sm)] bg-neu-soft text-neu font-semibold">
                  3.0 – 3.9: Trung lập
                </div>
                <div className="p-2 rounded-[var(--radius-sm)] bg-neg-soft text-neg font-semibold">
                  &lt; 3.0: Tiêu cực
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Browsing Recommendation */}
          <div className="flex flex-col justify-between h-full p-6 sm:p-8 rounded-[var(--radius-xl)] bg-surface border border-line shadow-[var(--shadow-sm)] space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-[var(--radius-lg)] bg-surface-subtle text-brand border border-line">
                  <Icon icon={Brain} size={24} />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-[var(--radius-full)] bg-surface-subtle text-ink-2 border border-line">
                  Trụ cột 02
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-ink">
                  Gợi ý dựa trên hành vi duyệt web
                </h3>
                <p className="text-sm text-ink-2 leading-relaxed">
                  Hệ thống thông minh ghi nhận các tương tác có ý nghĩa của người dùng (khi được bạn đồng ý) để hiểu bạn thực sự coi trọng yếu tố nào:
                </p>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-ink-2 pt-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <span><strong>Học tự nhiên:</strong> Tự động học từ thời gian dừng xem thông số, click so sánh và lọc đánh giá khía cạnh.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <span><strong>Khớp điểm thông minh:</strong> Đối chiếu trọng số ưu tiên của bạn với điểm ABSA để tính &quot;Độ phù hợp %&quot;.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                  <span><strong>Toàn quyền điều chỉnh:</strong> Thanh kéo tinh chỉnh giúp bạn can thiệp trực tiếp vào kết quả gợi ý.</span>
                </li>
              </ul>
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-4 rounded-[var(--radius-lg)] bg-surface-subtle border border-line text-xs space-y-1">
              <p className="font-semibold text-ink flex items-center gap-1.5">
                <Icon icon={ShieldCheck} size={16} className="text-pos" />
                <span>Cam kết tôn trọng quyền riêng tư:</span>
              </p>
              <p className="text-ink-2 leading-relaxed">
                Hệ thống chỉ kích hoạt học máy khi bạn chấp thuận trên thanh thông báo. Bạn có thể xóa lịch sử duyệt và tắt tính năng gợi ý bất kỳ lúc nào trong phần cài đặt tài khoản.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
