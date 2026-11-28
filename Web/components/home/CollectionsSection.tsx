"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface CollectionsSectionProps {
  collections: {
    flagship: Product[];
    upperMid: Product[];
    mid: Product[];
    gaming: Product[];
  };
  className?: string;
}

type TabKey = "flagship" | "upperMid" | "mid" | "gaming";

const TABS: Array<{ key: TabKey; label: string; description: string }> = [
  { key: "flagship", label: "Flagship cao cấp", description: "Công nghệ tiên phong và hoàn thiện tinh tế nhất" },
  { key: "upperMid", label: "Cận cao cấp", description: "Trải nghiệm tiệm cận flagship với mức giá tối ưu" },
  { key: "mid", label: "Tầm trung thực dụng", description: "Pin bền, hiệu năng đủ đầy và camera xuất sắc" },
  { key: "gaming", label: "Gaming chuyên sâu", description: "Tần số quét cao và tản nhiệt buồng hơi vượt trội" },
];

/**
 * Curated Collections Section conforming to page-design-guidelines.md S1.
 * Features tabs with role="tablist", arrow navigation, and a 4-card grid.
 */
export function CollectionsSection({
  collections,
  className,
}: CollectionsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("flagship");

  const currentProducts = collections[activeTab]?.slice(0, 4) || [];
  const currentTabMeta = TABS.find((t) => t.key === activeTab)!;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % TABS.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    }
    if (nextIndex !== index) {
      e.preventDefault();
      setActiveTab(TABS[nextIndex].key);
      const nextBtn = document.getElementById(`collection-tab-${TABS[nextIndex].key}`);
      nextBtn?.focus();
    }
  };

  return (
    <section className={cn("py-4", className)}>
      <Container size="xl" className="space-y-1 p-5 bg-white rounded-2xl">
        {/* Section Heading & Tabs row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-line">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Bộ sưu tập nổi bật
            </h2>
            <p className="text-xs sm:text-sm text-ink-2">
              {currentTabMeta.description}
            </p>
          </div>

          {/* Accessible Tablist */}
          <div
            role="tablist"
            aria-label="Danh mục bộ sưu tập điện thoại"
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
          >
            {TABS.map((tab, idx) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  id={`collection-tab-${tab.key}`}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`collection-panel-${tab.key}`}
                  tabIndex={active ? 0 : -1}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer border",
                    "focus-visible:outline-2 focus-visible:outline-brand",
                    active
                      ? "bg-brand text-ink-inverse border-brand shadow-xs"
                      : "bg-surface border-line text-ink-2 hover:bg-surface-subtle hover:text-ink"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Panel */}
        <div
          id={`collection-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`collection-tab-${activeTab}`}
          className="space-y-6 focus:outline-none"
        >
          {/* 4 Cards Grid (2 -> 3 -> 4 columns) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View More Link */}
          <div className="flex justify-center pt-2">
            <Link
              href={`/products?collection=${activeTab}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg border border-line bg-surface hover:bg-surface-subtle text-ink transition-colors group focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span>Xem thêm điện thoại trong mục {currentTabMeta.label}</span>
              <Icon
                icon={ArrowRight}
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
