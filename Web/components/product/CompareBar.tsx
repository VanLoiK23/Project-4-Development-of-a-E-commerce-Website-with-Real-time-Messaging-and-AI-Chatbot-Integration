"use client";

import React from "react";
import Link from "next/link";
import { GitCompare, X, ChevronDown, Plus, ArrowRight } from "lucide-react";
import { useCompare } from "@/hooks/use-compare";
import { PhonePlaceholder } from "@/mocks/phone-placeholder";
import { formatVND } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * Floating Comparison Bar conforming to user reference images [cite: 3, 4] and design guidelines.
 * Appears when items.length >= 1 (max 3).
 * Supports Expanded mode and Collapsed pill mode ("So sánh (N)").
 */
export function CompareBar() {
  const {
    items,
    isCollapsed,
    removeFromCompare,
    clearCompare,
    toggleCollapse,
    maxCompare,
  } = useCompare();

  // If no items in compare list, do not render
  if (items.length === 0) {
    return null;
  }

  // Generate target compare URL with ids parameter: /compare?ids=p1,p2,p3
  const compareUrl = `/compare?ids=${items.map((i) => i.productId).join(",")}`;

  // 1. COLLAPSED STATE: Pill floating at bottom-left [cite: 4]
  if (isCollapsed) {
    return (
      <div className="fixed bottom-20 lg:bottom-6 left-4 z-[1250] flex items-center animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div
          role="region"
          aria-label="Thanh so sánh thu gọn"
          className="flex items-center gap-1.5 bg-brand text-ink-inverse pl-4 pr-1.5 py-1.5 rounded-full shadow-xl border border-white/20 select-none group"
        >
          <button
            type="button"
            onClick={toggleCollapse}
            className="flex items-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-white rounded-full pr-1"
          >
            <Icon icon={GitCompare} size={17} className="text-ai" />
            <span className="text-xs font-semibold tracking-wide">
              So sánh ({items.length})
            </span>
          </button>

          {/* Quick close/clear all button */}
          <button
            type="button"
            onClick={clearCompare}
            title="Đóng và xóa danh sách so sánh"
            aria-label="Xóa tất cả sản phẩm so sánh"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <Icon icon={X} size={14} />
          </button>
        </div>
      </div>
    );
  }

  // 2. EXPANDED STATE: Full comparison docking bar [cite: 3]
  // Remaining empty slots up to max 3
  const emptySlotsCount = Math.max(0, maxCompare - items.length);

  return (
    <aside
      aria-label="Bảng so sánh sản phẩm"
      className="fixed bottom-16 lg:bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-4xl mx-auto z-[1250] bg-surface/98 backdrop-blur-md border border-line rounded-2xl shadow-xl p-3 sm:p-4 animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {/* Bar Top Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-line/60">
        <div className="flex items-center gap-2">
          <Icon icon={GitCompare} size={18} className="text-brand" />
          <span className="text-xs sm:text-sm font-semibold text-ink">
            So sánh sản phẩm ({items.length}/{maxCompare})
          </span>
          <button
            type="button"
            onClick={clearCompare}
            className="text-[11px] text-ink-3 hover:text-danger ml-2 underline cursor-pointer"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Collapse toggle button */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="inline-flex items-center gap-1 text-xs text-ink-2 hover:text-ink font-medium px-2 py-1 rounded-md hover:bg-surface-subtle transition-colors cursor-pointer"
        >
          <span>Thu gọn</span>
          <Icon icon={ChevronDown} size={14} />
        </button>
      </div>

      {/* Grid of Slots & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Selected phones list */}
        <div className="grid grid-cols-3 gap-2 w-full sm:w-auto sm:flex-1 max-w-xl">
          {items.map((item) => (
            <div
              key={item.productId}
              className="relative flex items-center gap-2 p-1.5 sm:p-2 bg-canvas/80 border border-line rounded-xl overflow-hidden group"
            >
              <div className="w-10 h-10 shrink-0 bg-surface rounded-lg p-0.5 border border-line/40 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                <PhonePlaceholder brand={item.brand} className="w-full h-full" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-4">
                <p className="text-[11px] sm:text-xs font-semibold text-ink truncate">
                  {item.name}
                </p>
                <p className="text-[10px] text-ink-3 truncate">
                  {item.storageLabel} • {formatVND(item.price)}
                </p>
              </div>

              {/* Remove single phone button */}
              <button
                type="button"
                onClick={() => removeFromCompare(item.productId)}
                aria-label={`Xóa ${item.name} khỏi so sánh`}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-surface-subtle hover:bg-danger-soft hover:text-danger text-ink-3 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Icon icon={X} size={12} />
              </button>
            </div>
          ))}

          {/* Empty slot placeholders */}
          {Array.from({ length: emptySlotsCount }).map((_, idx) => (
            <a
              key={idx}
              href="#catalog-filters"
              className="flex items-center justify-center gap-1 p-2 border border-dashed border-line rounded-xl text-ink-3 hover:text-ink hover:border-brand/40 bg-surface-subtle/30 transition-colors text-center cursor-pointer min-h-[48px]"
            >
              <Icon icon={Plus} size={14} />
              <span className="text-[11px] font-medium hidden xs:inline">
                + Thêm máy
              </span>
            </a>
          ))}
        </div>

        {/* Compare CTA Action button */}
        <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
          <Link href={compareUrl} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              className="w-full sm:w-auto gap-2 px-5 py-2.5 font-semibold shadow-sm"
            >
              <span>So sánh ngay</span>
              <Icon icon={ArrowRight} size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
}
