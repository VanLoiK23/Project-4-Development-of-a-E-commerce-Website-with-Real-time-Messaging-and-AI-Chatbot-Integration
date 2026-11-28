"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Filter, ArrowUpDown, RotateCcw, ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import {
  FilterOptions,
  FILTER_OPTIONS,
  ProductFilterState,
  buildProductQuery,
} from "@/constants/filters";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterModal, ActiveFilters } from "@/components/home/FilterModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/layout/Container";
import { fetchProductsPage } from "@/api/products";
import { cn } from "@/lib/utils";

export interface CatalogFilterSectionProps {
  products: Product[];
  filterOptions?: FilterOptions;
  className?: string;
}

type SortKey = "popular" | "newest" | "reviews" | "price_asc" | "price_desc";

const INITIAL_FILTERS: ActiveFilters = {
  collections: [],
  brands: [],
  pricePresetId: null,
  minPrice: null,
  maxPrice: null,
  os: [],
  ramGb: [],
  storageGb: [],
  resolutions: [],
  refreshRates: [],
  charging: [],
  features: [],
  quickTags: [],
};

function toFilterState(filters: ActiveFilters, sort: SortKey): ProductFilterState {
  return {
    brands: filters.brands.length > 0 ? filters.brands : undefined,
    pricePresetId: filters.pricePresetId || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    os: filters.os.length > 0 ? filters.os : undefined,
    ramGb: filters.ramGb.length > 0 ? filters.ramGb : undefined,
    storageGb: filters.storageGb.length > 0 ? filters.storageGb : undefined,
    resolutions: filters.resolutions.length > 0 ? filters.resolutions : undefined,
    refreshRates: filters.refreshRates.length > 0 ? filters.refreshRates : undefined,
    charging: filters.charging.length > 0 ? filters.charging : undefined,
    quickTags: filters.quickTags.length > 0 ? filters.quickTags : undefined,
    features: filters.features.length > 0 ? filters.features : undefined,
    sort,
    page: 0,
  };
}

export function CatalogFilterSection({
  products: initialProducts,
  filterOptions = FILTER_OPTIONS,
  className,
}: CatalogFilterSectionProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(INITIAL_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>("popular");

  const [displayedProducts, setDisplayedProducts] = useState<Product[]>(
    initialProducts.slice(0, 8)
  );
  const [totalElements, setTotalElements] = useState<number>(initialProducts.length);
  const [isLoading, setIsLoading] = useState(false);

  const isFirstMount = useRef(true);

  // Toggle brand in quick chip bar
  const handleToggleBrand = (brand: string) => {
    setActiveFilters((prev) => {
      const exists = prev.brands.includes(brand);
      return {
        ...prev,
        brands: exists
          ? prev.brands.filter((b) => b !== brand)
          : [...prev.brands, brand],
      };
    });
  };

  // Toggle quick tag in quick chip bar
  const handleToggleTag = (tag: string) => {
    setActiveFilters((prev) => {
      const exists = prev.quickTags.includes(tag);
      return {
        ...prev,
        quickTags: exists
          ? prev.quickTags.filter((t) => t !== tag)
          : [...prev.quickTags, tag],
      };
    });
  };

  // Handle Sort selection
  const handleSortClick = (key: "popular" | "newest" | "reviews" | "price") => {
    if (key === "price") {
      setSortKey((prev) => (prev === "price_asc" ? "price_desc" : "price_asc"));
    } else {
      setSortKey(key);
    }
  };

  const handleResetFilters = () => {
    setActiveFilters(INITIAL_FILTERS);
    setSortKey("popular");
  };

  // Whenever filters or sort changes after first mount, fetch from Backend
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const filterState = toFilterState(activeFilters, sortKey);

    fetchProductsPage(filterState)
      .then((res) => {
        if (!isMounted) return;
        if (res.ok) {
          // Backend limit is 8, ensure at most 8 are displayed
          setDisplayedProducts(res.data.products.slice(0, 8));
          setTotalElements(res.data.totalElements ?? res.data.products.length);
        }
      })
      .catch((err) => {
        console.error("Filter fetch failed:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilters, sortKey]);

  // Active filter count for badge
  const activeCount =
    (activeFilters.collections?.length || 0) +
    activeFilters.brands.length +
    (activeFilters.pricePresetId || activeFilters.minPrice ? 1 : 0) +
    activeFilters.os.length +
    activeFilters.ramGb.length +
    activeFilters.storageGb.length +
    activeFilters.refreshRates.length +
    activeFilters.resolutions.length +
    activeFilters.charging.length +
    activeFilters.features.length +
    activeFilters.quickTags.length;

  const currentQueryString = buildProductQuery(toFilterState(activeFilters, sortKey));

  return (
    <section id="catalog-filters" className={cn("py-4", className)}>
      <Container size="xl" className="space-y-1 p-5 bg-white rounded-2xl">
        {/* Section title & count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-line">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Khám phá & Chọn lọc điện thoại
            </h2>
            <p className="text-xs sm:text-sm text-ink-2">
              Bộ lọc đa thông số và sắp xếp theo đánh giá thực tế
            </p>
          </div>
          <span className="text-xs sm:text-sm font-medium text-ink-3">
            Hiển thị <span className="font-bold text-ink">{displayedProducts.length}</span> máy
            {totalElements > displayedProducts.length && ` (trong tổng số ${totalElements})`}
          </span>
        </div>

        {/* 1. Quick Horizontal Filter Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* Main "Lọc" button with funnel icon */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all border",
              "focus-visible:outline-2 focus-visible:outline-brand",
              activeCount > 0
                ? "bg-brand text-ink-inverse border-brand shadow-xs"
                : "bg-surface border-line text-ink hover:bg-surface-subtle"
            )}
          >
            <Icon icon={Filter} size={15} />
            <span>Lọc</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-brand text-[10px] font-bold flex items-center justify-center ml-0.5">
                {activeCount}
              </span>
            )}
          </button>

          {/* Brand chips */}
          {filterOptions.brands.slice(0, 6).map((brand) => {
            const isSelected = activeFilters.brands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => handleToggleBrand(brand)}
                className={cn(
                  "h-9 px-3.5 rounded-full text-xs font-medium shrink-0 cursor-pointer transition-all border",
                  "focus-visible:outline-2 focus-visible:outline-brand",
                  isSelected
                    ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                    : "bg-surface border-line text-ink-2 hover:bg-surface-subtle hover:text-ink"
                )}
              >
                {brand}
              </button>
            );
          })}

          {/* Quick need chips */}
          {filterOptions.quickTags.slice(0, 3).map((tag) => {
            const isSelected = activeFilters.quickTags.includes(String(tag.value));
            return (
              <button
                key={tag.value}
                type="button"
                onClick={() => handleToggleTag(String(tag.value))}
                className={cn(
                  "h-9 px-3.5 rounded-full text-xs font-medium shrink-0 cursor-pointer transition-all border",
                  "focus-visible:outline-2 focus-visible:outline-brand",
                  isSelected
                    ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                    : "bg-surface border-line text-ink-2 hover:bg-surface-subtle hover:text-ink"
                )}
              >
                {tag.label}
              </button>
            );
          })}

          {/* Clear all active filters if any */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-ink-3 hover:text-danger px-2 shrink-0 cursor-pointer"
            >
              <Icon icon={RotateCcw} size={13} />
              <span>Xóa lọc</span>
            </button>
          )}
        </div>

        {/* 2. Sort Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
          <span className="font-semibold text-ink-2 mr-1">Sắp xếp theo:</span>

          <button
            type="button"
            onClick={() => handleSortClick("popular")}
            className={cn(
              "px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
              sortKey === "popular"
                ? "bg-brand text-ink-inverse border-brand font-semibold"
                : "bg-surface border-line text-ink-2 hover:bg-surface-subtle"
            )}
          >
            Nổi bật
          </button>

          <button
            type="button"
            onClick={() => handleSortClick("reviews")}
            className={cn(
              "px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
              sortKey === "reviews"
                ? "bg-brand text-ink-inverse border-brand font-semibold"
                : "bg-surface border-line text-ink-2 hover:bg-surface-subtle"
            )}
          >
            Đánh giá
          </button>

          <button
            type="button"
            onClick={() => handleSortClick("newest")}
            className={cn(
              "px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
              sortKey === "newest"
                ? "bg-brand text-ink-inverse border-brand font-semibold"
                : "bg-surface border-line text-ink-2 hover:bg-surface-subtle"
            )}
          >
            Mới
          </button>

          {/* Price with direction toggle */}
          <button
            type="button"
            onClick={() => handleSortClick("price")}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
              sortKey === "price_asc" || sortKey === "price_desc"
                ? "bg-brand text-ink-inverse border-brand font-semibold"
                : "bg-surface border-line text-ink-2 hover:bg-surface-subtle"
            )}
          >
            <span>
              Giá {sortKey === "price_asc" ? "↑" : sortKey === "price_desc" ? "↓" : ""}
            </span>
            <Icon icon={ArrowUpDown} size={13} />
          </button>
        </div>

        {/* 3. Product Results Grid (max 8 products) */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface p-4 rounded-xl border border-line space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {displayedProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Không tìm thấy điện thoại phù hợp"
            description="Hãy thử bỏ chọn một số tiêu chí hoặc xóa toàn bộ bộ lọc để xem lại danh sách sản phẩm."
            actionLabel="Đặt lại bộ lọc"
            onAction={handleResetFilters}
            className="my-8"
          />
        )}

        {/* 4. "Xem thêm điện thoại" Button */}
        {displayedProducts.length > 0 && (
          <div className="flex justify-center pt-4">
            <Link
              href={`/products?${currentQueryString}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg border border-line bg-surface hover:bg-surface-subtle text-ink transition-colors group focus-visible:outline-2 focus-visible:outline-brand"
            >
              <span>Xem thêm điện thoại</span>
              <Icon
                icon={ArrowRight}
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        )}
      </Container>

      {/* Advanced Filter Modal/Drawer */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        options={filterOptions}
        activeFilters={activeFilters}
        onChange={setActiveFilters}
        onReset={handleResetFilters}
        matchingCount={totalElements}
        showCollection={false}
      />
    </section>
  );
}
