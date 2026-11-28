import React from "react";
import Link from "next/link";
import { AspectLeader } from "@/types/absa";
import { AspectScorePill } from "@/components/absa/AspectScorePill";
import { PhonePlaceholder } from "@/mocks/phone-placeholder";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export interface AbsaHighlightsSectionProps {
  aspectLeaders: AspectLeader[];
  className?: string;
}

/**
 * ABSA Community Highlights Section conforming to page-design-guidelines.md S1 & §5.
 * Dynamically rendered from data (never hardcoded aspect keys).
 * Displays top 3 phones for top 3 community aspects.
 */
export function AbsaHighlightsSection({
  aspectLeaders,
  className,
}: AbsaHighlightsSectionProps) {
  return (
    <section className={cn("py-4 bg-surface-subtle/20 border-t border-line/60", className)}>
      <Container size="xl" className="space-y-1 p-5 bg-white rounded-2xl">
        {/* Section Heading */}
        <div className="space-y-1 pb-2 border-b border-line">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            Được cộng đồng đánh giá cao theo từng khía cạnh
          </h2>
          <p className="text-xs sm:text-sm text-ink-2">
            Tổng hợp khách quan từ hàng nghìn phản hồi thực tế của người dùng đã mua máy
          </p>
        </div>

        {/* 3 Columns Grid for 3 Top Aspects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aspectLeaders.slice(0, 3).map((leader) => (
            <div
              key={leader.aspectKey}
              className="flex flex-col bg-surface border border-line rounded-xl p-5 shadow-xs space-y-4"
            >
              {/* Aspect Column Header */}
              <div className="pb-3 border-b border-line/60">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 block mb-1">
                  Khía cạnh đánh giá
                </span>
                <h3 className="text-base font-bold text-ink">
                  {leader.displayName}
                </h3>
              </div>

              {/* 3 Ranked Phones */}
              <div className="space-y-3.5 flex-1">
                {leader.products.slice(0, 3).map((product, rank) => {
                  // Find score for this specific aspect on product
                  const aspectScore =
                    product.aspects.find((a) => a.aspectKey === leader.aspectKey) ||
                    product.aspects[0];

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-subtle/70 transition-colors group focus-visible:outline-2 focus-visible:outline-brand"
                    >
                      {/* Rank Index */}
                      <span className="text-xs font-bold text-ink-3 w-4 shrink-0 text-center">
                        #{rank + 1}
                      </span>

                      {/* Mini Thumbnail */}
                      <div className="w-11 h-11 shrink-0 bg-surface rounded-md p-0.5 border border-line/60 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover rounded-lg"
                          />
                        ) : (
                          <PhonePlaceholder brand={product.brand} className="w-full h-full" />
                        )}
                      </div>

                      {/* Phone Name & Aspect Score */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-ink truncate group-hover:text-brand-hover transition-colors">
                          {product.name}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <AspectScorePill
                            score={aspectScore.score}
                            size="sm"
                            mentionCount={aspectScore.mentionCount}
                          />
                          <span className="text-[10px] text-ink-3 truncate">
                            dựa trên {aspectScore.mentionCount} lượt nhắc
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
