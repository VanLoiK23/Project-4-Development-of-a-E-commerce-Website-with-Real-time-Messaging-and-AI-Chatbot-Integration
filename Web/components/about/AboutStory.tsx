import React from "react";
import { CheckCircle2, Award } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface AboutStoryProps {
  className?: string;
}

export function AboutStory({ className }: AboutStoryProps) {
  const commitments = [
    {
      title: "Đánh giá ABSA khách quan theo khía cạnh",
      desc: "Bóc tách độc lập pin, camera, nhiệt độ, màn hình từ phản hồi của khách hàng đã mua và trải nghiệm thực tế.",
    },
    {
      title: "Gợi ý cá nhân hóa dựa trên hành vi",
      desc: "Học mức độ quan tâm của bạn qua hành vi duyệt để xếp hạng điện thoại phù hợp nhất mà không cần nhập bảng hỏi phức tạp.",
    },
    {
      title: "100% Sản phẩm chính hãng phân phối",
      desc: "Cam kết máy mới nguyên seal, nguồn gốc minh bạch, đầy đủ hóa đơn VAT và bảo hành hãng toàn quốc.",
    },
    {
      title: "Minh bạch và bảo vệ quyền riêng tư",
      desc: "Người dùng toàn quyền xem những gì hệ thống đã học, điều chỉnh trọng số hoặc xóa vĩnh viễn lịch sử bất kỳ lúc nào.",
    },
  ];

  return (
    <section aria-labelledby="about-story-heading" className={cn("py-12 sm:py-16", className)}>
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Visual Highlight Card */}
          <div className="lg:col-span-5 relative flex flex-col">
            <div className="relative rounded-[var(--radius-xl)] bg-brand text-ink-inverse p-8 sm:p-10 shadow-[var(--shadow-lg)] flex flex-col justify-between flex-1 space-y-6 overflow-hidden">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-brand-hover border border-line/20 flex items-center justify-center text-ai">
                  <Icon icon={Award} size={24} />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-[var(--color-text-subtle)] font-semibold">
                    Tầm nhìn & Đột phá
                  </span>
                  <h3 className="text-2xl font-bold leading-snug">
                    Đánh giá đúng thực tế, mua đúng nhu cầu
                  </h3>
                </div>

                <p className="text-sm text-[var(--color-text-subtle)] leading-relaxed">
                  Người tiêu dùng Việt Nam xứng đáng nhận được thông tin trung thực, không bị chi phối bởi các chiến dịch tiếp thị rầm rộ hay những bài review chung chung.
                </p>
              </div>

              {/* Stat callout */}
              <div className="pt-6 border-t border-brand-hover grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-ink-inverse">
                    5.000+
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                    Đánh giá đã phân tích ABSA
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-ai">
                    98.5%
                  </p>
                  <p className="text-xs text-[var(--color-text-subtle)] mt-1">
                    Độ chính xác mô hình học máy
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Narrative & Commitments */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-2">
                Sứ mệnh của chúng tôi
              </span>
              <h2 id="about-story-heading" className="text-2xl sm:text-3xl font-bold text-ink">
                Hệ thống bán lẻ điện thoại lấy minh bạch dữ liệu làm trọng tâm
              </h2>
              <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
                Khi chọn mua một chiếc smartphone, mỗi người có một ưu tiên khác nhau: một tài xế công nghệ cần pin trâu và GPS nhạy; một game thủ cần màn hình tần số quét cao và tản nhiệt mát mẻ; một người sáng tạo nội dung cần camera chụp thiếu sáng ấn tượng.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {commitments.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-[var(--radius-lg)] bg-surface border border-line space-y-1.5 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex items-center gap-2">
                    <Icon icon={CheckCircle2} size={18} className="text-pos shrink-0" />
                    <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
                  </div>
                  <p className="text-xs text-ink-2 leading-relaxed pl-6.5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
