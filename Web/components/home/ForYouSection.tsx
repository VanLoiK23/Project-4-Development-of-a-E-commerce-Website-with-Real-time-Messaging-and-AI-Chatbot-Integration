"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Recommendation } from "@/types/home";
import { ProductCard } from "@/components/product/ProductCard";
import { ReasonChip } from "@/components/recommendation/ReasonChip";
import { Skeleton } from "@/components/ui/Skeleton";
import { Icon } from "@/components/ui/Icon";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export interface ForYouSectionProps {
  recommendations: Recommendation[];
  profile?: "ready" | "cold";
  loading?: boolean;
  className?: string;
}

/**
 * RecommendationRail ("Dành cho bạn") conforming to component-guidelines.md §4.8.
 * Supports horizontal scroll-snap, desktop arrow controls,
 * and distinct profile=ready vs profile=cold personalization honesty.
 */
export function ForYouSection({
  recommendations,
  profile = "ready",
  loading = false,
  className,
}: ForYouSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isReady = profile === "ready";

  if (!loading && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className={cn("py-4 bg-surface-subtle/30 border-y border-line/60", className)}>
      <Container size="xl" className="space-y-1 p-5 bg-white rounded-2xl">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
                {isReady ? "Dành cho bạn" : "Được đánh giá cao nhất"}
              </h2>
              {isReady && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ai-soft text-ai-ink border border-ai/30">
                  <Icon icon={Sparkles} size={12} className="text-ai" />
                  <span>AI Đề xuất</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-ink-2">
              {isReady ? (
                <span>
                  Dựa trên các máy bạn đã xem •{" "}
                  <Link
                    href="/recommendation"
                    className="font-medium text-ink underline-offset-4 hover:underline"
                  >
                    Xem vì sao gợi ý
                  </Link>
                </span>
              ) : (
                "Xem thêm vài máy để chúng tôi gợi ý đúng ý bạn hơn"
              )}
            </p>
          </div>

          {/* Desktop Left / Right Navigation Buttons */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Cuộn sang trái"
              className="w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Icon icon={ChevronLeft} size={18} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Cuộn sang phải"
              className="w-9 h-9 rounded-full bg-surface border border-line flex items-center justify-center text-ink-2 hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
            >
              <Icon icon={ChevronRight} size={18} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll-snap Track */}
        <div
          ref={scrollRef}
          tabIndex={0}
          role="region"
          aria-label={isReady ? "Danh sách gợi ý dành cho bạn" : "Danh sách điện thoại đánh giá cao"}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none focus-visible:outline-2 focus-visible:outline-brand rounded-xl"
        >
          {loading ? (
            // Warm Loading Skeletons
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="w-[260px] sm:w-[290px] shrink-0 snap-start bg-surface rounded-xl border border-line p-4 space-y-4"
              >
                <Skeleton className="w-full aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))
          ) : (
            // Render Recommendation Cards
            recommendations.map((rec) => (
              <div
                key={rec.product.id}
                className="w-[260px] sm:w-[290px] shrink-0 snap-start flex flex-col"
              >
                <ProductCard
                  product={rec.product}
                  matchPercent={isReady ? rec.matchPercent : undefined}
                  className="flex-1"
                />

                {/* Reason chip 1 line below card when ready */}
                {isReady && rec.reasons.length > 0 && (
                  <div className="mt-2 px-1">
                    <ReasonChip>{rec.reasons[0].text}</ReasonChip>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
