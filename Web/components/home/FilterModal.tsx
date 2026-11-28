"use client";

import React, { useEffect, useRef } from "react";
import { X, RotateCcw, Check } from "lucide-react";
import { FilterOptions, FeatureKey, FILTER_OPTIONS } from "@/constants/filters";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface ActiveFilters {
  collections?: string[];
  brands: string[];
  pricePresetId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  os: string[];
  ramGb: number[];
  storageGb: number[];
  resolutions: string[];
  refreshRates: number[];
  charging: string[];
  features: FeatureKey[];
  quickTags: string[];
}

export const COLLECTION_FILTER_OPTIONS = [
  { key: "flagship", label: "Flagship cao cấp" },
  { key: "upperMid", label: "Cận cao cấp" },
  { key: "mid", label: "Tầm trung thực dụng" },
  { key: "gaming", label: "Gaming chuyên sâu" },
] as const;

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  options?: FilterOptions;
  activeFilters: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
  onReset: () => void;
  matchingCount: number;
  showCollection?: boolean;
}

export function FilterModal({
  isOpen,
  onClose,
  options = FILTER_OPTIONS,
  activeFilters,
  onChange,
  onReset,
  matchingCount,
  showCollection = false,
}: FilterModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Keyboard navigation & focus restoration
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
        triggerRef.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generic toggle for string array
  const toggleStringItem = (key: "brands" | "os" | "resolutions" | "charging" | "quickTags", value: string) => {
    const list = activeFilters[key] || [];
    const updated = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    onChange({ ...activeFilters, [key]: updated });
  };

  // Generic toggle for number array
  const toggleNumberItem = (key: "ramGb" | "storageGb" | "refreshRates", value: number) => {
    const list = activeFilters[key] || [];
    const updated = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    onChange({ ...activeFilters, [key]: updated });
  };

  // Toggle for boolean feature flags
  const toggleFeature = (value: FeatureKey) => {
    const list = activeFilters.features || [];
    const updated = list.includes(value)
      ? list.filter((item) => item !== value)
      : [...list, value];
    onChange({ ...activeFilters, features: updated });
  };

  const handlePresetSelect = (preset: { id: string; min: number; max: number }) => {
    if (activeFilters.pricePresetId === preset.id) {
      onChange({
        ...activeFilters,
        pricePresetId: null,
        minPrice: null,
        maxPrice: null,
      });
    } else {
      onChange({
        ...activeFilters,
        pricePresetId: preset.id,
        minPrice: preset.min,
        maxPrice: preset.max,
      });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Tất cả bộ lọc sản phẩm"
      className="fixed inset-0 z-[1300] flex items-center justify-center p-0 sm:p-4 bg-ink/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Card / Bottom sheet on mobile */}
      <div
        ref={modalRef}
        className="relative z-10 w-full sm:max-w-2xl lg:max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-surface rounded-t-2xl sm:rounded-2xl border border-line shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-line bg-surface shrink-0">
          <div>
            <h2 className="text-lg font-bold text-ink">Tất cả bộ lọc</h2>
            <p className="text-xs text-ink-3">Tùy chọn đa tiêu chí theo thông số chuẩn từ cơ sở dữ liệu</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng bộ lọc"
            className="w-8 h-8 rounded-full bg-surface-subtle hover:bg-surface border border-line flex items-center justify-center text-ink-2 hover:text-ink transition-colors cursor-pointer"
          >
            <Icon icon={X} size={18} />
          </button>
        </div>

        {/* Scrollable Body containing filter groups */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm">
          {/* 1. Bộ sưu tập (nếu được kích hoạt trên trang sản phẩm) */}
          {showCollection && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-ink text-sm">Bộ sưu tập</h3>
                {activeFilters.collections && activeFilters.collections.length > 0 && (
                  <span className="text-xs text-brand font-medium">
                    Đã chọn {activeFilters.collections.length}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {COLLECTION_FILTER_OPTIONS.map((col) => {
                  const currentCols = activeFilters.collections || [];
                  const active = currentCols.includes(col.key) || currentCols.includes(col.label);
                  return (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => {
                        const updated = active
                          ? currentCols.filter((k) => k !== col.key && k !== col.label)
                          : [...currentCols, col.key];
                        onChange({ ...activeFilters, collections: updated });
                      }}
                      className={cn(
                        "py-2 px-3 rounded-lg border text-xs font-medium transition-all text-center cursor-pointer flex items-center justify-center gap-1",
                        active
                          ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                          : "bg-surface text-ink-2 border-line hover:bg-surface-subtle hover:text-ink"
                      )}
                    >
                      {active && <Icon icon={Check} size={13} className="shrink-0" />}
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Thương hiệu */}
          <div className={cn("space-y-2.5", showCollection && "pt-2 border-t border-line/60")}>
            <h3 className="font-semibold text-ink text-sm">Thương hiệu</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {options.brands.map((brand) => {
                const active = activeFilters.brands.includes(brand);
                return (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleStringItem("brands", brand)}
                    className={cn(
                      "py-2 px-3 rounded-lg border text-xs font-medium transition-all text-center cursor-pointer flex items-center justify-center gap-1",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle hover:text-ink"
                    )}
                  >
                    {active && <Icon icon={Check} size={13} className="shrink-0" />}
                    <span>{brand}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Khoảng giá (Presets + Custom Min/Max) */}
          <div className="space-y-3 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Khoảng giá</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {options.pricePresets.map((preset) => {
                const active = activeFilters.pricePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetSelect(preset)}
                    className={cn(
                      "py-2 px-3 rounded-lg border text-xs transition-all text-center cursor-pointer",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle hover:text-ink"
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom min/max inputs */}
            <div className="pt-2">
              <span className="text-xs text-ink-3 block mb-1.5">
                Hoặc chọn mức giá phù hợp với bạn:
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từ (đ)"
                  value={activeFilters.minPrice ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...activeFilters,
                      pricePresetId: null,
                      minPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full h-9 px-3 rounded-md border border-line bg-surface text-xs text-ink focus-visible:outline-2 focus-visible:outline-brand"
                />
                <span className="text-ink-3 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Đến (đ)"
                  value={activeFilters.maxPrice ?? ""}
                  onChange={(e) =>
                    onChange({
                      ...activeFilters,
                      pricePresetId: null,
                      maxPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="w-full h-9 px-3 rounded-md border border-line bg-surface text-xs text-ink focus-visible:outline-2 focus-visible:outline-brand"
                />
              </div>
            </div>
          </div>

          {/* 4. Hệ điều hành (thay cho loại sản phẩm) */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Hệ điều hành</h3>
            <div className="flex flex-wrap gap-2">
              {options.osOptions.map((opt) => {
                const active = activeFilters.os.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleStringItem("os", opt.value)}
                    className={cn(
                      "py-1.5 px-3.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {active && <Icon icon={Check} size={13} className="shrink-0" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Bộ nhớ RAM */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Bộ nhớ RAM</h3>
            <div className="flex flex-wrap gap-2">
              {options.ramOptions.map((opt) => {
                const active = activeFilters.ramGb.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleNumberItem("ramGb", opt.value)}
                    className={cn(
                      "py-1.5 px-3 rounded-lg border text-xs transition-colors cursor-pointer",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Dung lượng lưu trữ */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Dung lượng lưu trữ</h3>
            <div className="flex flex-wrap gap-2">
              {options.storageOptions.map((opt) => {
                const active = activeFilters.storageGb.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleNumberItem("storageGb", opt.value)}
                    className={cn(
                      "py-1.5 px-3 rounded-lg border text-xs transition-colors cursor-pointer",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Độ phân giải màn hình */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Độ phân giải màn hình</h3>
            <div className="flex flex-wrap gap-2">
              {options.resolutions.map((opt) => {
                const active = activeFilters.resolutions.includes(String(opt.value));
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleStringItem("resolutions", String(opt.value))}
                    className={cn(
                      "py-1.5 px-3 rounded-lg border text-xs transition-colors cursor-pointer",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 8. Tần số quét */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Tần số quét màn hình</h3>
            <div className="flex flex-wrap gap-2">
              {options.refreshRates.map((opt) => {
                const active = activeFilters.refreshRates.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleNumberItem("refreshRates", opt.value)}
                    className={cn(
                      "py-1.5 px-3 rounded-lg border text-xs transition-colors cursor-pointer",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 9. Công nghệ sạc */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Công nghệ Pin & Sạc</h3>
            <div className="flex flex-wrap gap-2">
              {options.chargingOptions.map((opt) => {
                const active = activeFilters.charging.includes(String(opt.value));
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleStringItem("charging", String(opt.value))}
                    className={cn(
                      "py-1.5 px-3 rounded-lg border text-xs transition-colors cursor-pointer",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 10. Tính năng đặc biệt (featureToggles) */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Tính năng & Tiện ích</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {options.featureToggles.map((opt) => {
                const active = activeFilters.features.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleFeature(opt.value)}
                    className={cn(
                      "py-2 px-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 text-center",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {active && <Icon icon={Check} size={13} className="shrink-0" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 11. Nhu cầu nổi bật (quickTags) */}
          <div className="space-y-2.5 pt-2 border-t border-line/60">
            <h3 className="font-semibold text-ink text-sm">Nhu cầu nổi bật</h3>
            <div className="flex flex-wrap gap-2">
              {options.quickTags.map((opt) => {
                const active = activeFilters.quickTags.includes(String(opt.value));
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleStringItem("quickTags", String(opt.value))}
                    className={cn(
                      "py-1.5 px-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1",
                      active
                        ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                        : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                    )}
                  >
                    {active && <Icon icon={Check} size={13} className="shrink-0" />}
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 sm:p-5 border-t border-line bg-surface-subtle/40 flex items-center justify-between gap-3 shrink-0">
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            className="text-xs sm:text-sm text-ink-2 hover:text-ink gap-1.5"
          >
            <Icon icon={RotateCcw} size={15} />
            <span>Bỏ chọn</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onClose}
            className="flex-1 sm:flex-initial sm:min-w-[200px] text-xs sm:text-sm font-semibold"
          >
            Xem {matchingCount} kết quả
          </Button>
        </div>
      </div>
    </div>
  );
}
