import React from "react";
import Link from "next/link";
import { Smartphone, Star, ArrowUpRight } from "lucide-react";
import { RelatedPhone } from "@/types/blog";
import { formatVND } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface RelatedPhonesProps {
  phones: RelatedPhone[];
  className?: string;
}

export function RelatedPhones({ phones, className }: RelatedPhonesProps) {
  if (!phones || phones.length === 0) return null;

  return (
    <div
      className={cn(
        "p-6 rounded-[var(--radius-xl)] bg-surface border border-line shadow-[var(--shadow-sm)] space-y-4 my-8",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-line pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-[var(--radius-sm)] bg-surface-subtle text-brand">
            <Icon icon={Smartphone} size={18} />
          </div>
          <h3 className="text-base font-bold text-ink">
            Điện thoại được đề cập trong bài viết
          </h3>
        </div>
        <span className="text-xs text-ink-3">Điểm ABSA cập nhật</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {phones.map((phone) => {
          const isPos = phone.topAspect.score >= 4.0;
          const isNeu = phone.topAspect.score >= 3.0 && phone.topAspect.score < 4.0;

          return (
            <div
              key={phone.id}
              className="group flex items-center gap-4 p-3 rounded-[var(--radius-lg)] bg-surface-subtle/50 hover:bg-surface-subtle border border-line transition-all"
            >
              <div className="w-16 h-16 rounded-[var(--radius-md)] bg-surface border border-line flex items-center justify-center shrink-0">
                <Icon icon={Smartphone} size={28} className="text-ink-2" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-semibold text-ink truncate group-hover:text-brand transition-colors">
                  <Link href={`/products/${phone.slug}`} className="focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]">
                    {phone.name}
                  </Link>
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">
                    {formatVND(phone.price)}
                  </span>
                  {phone.originalPrice && (
                    <span className="text-xs text-ink-3 line-through">
                      {formatVND(phone.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Aspect Badge */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-full)] text-[11px] font-semibold",
                      isPos && "bg-pos-soft text-pos",
                      isNeu && "bg-neu-soft text-neu",
                      !isPos && !isNeu && "bg-neg-soft text-neg"
                    )}
                  >
                    <Icon icon={Star} size={11} className="fill-current" />
                    <span>{phone.topAspect.score.toFixed(1)}</span>
                    <span className="font-normal opacity-90">{phone.topAspect.name}</span>
                  </span>
                </div>
              </div>

              <Link
                href={`/products/${phone.slug}`}
                className="p-2 rounded-[var(--radius-md)] text-ink-3 hover:text-brand hover:bg-surface focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] shrink-0"
                aria-label={`Xem thông số ${phone.name}`}
              >
                <Icon icon={ArrowUpRight} size={18} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
