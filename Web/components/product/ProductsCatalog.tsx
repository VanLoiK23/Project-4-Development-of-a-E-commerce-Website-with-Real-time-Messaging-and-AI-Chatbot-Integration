"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Filter,
  ArrowUpDown,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Home,
  Sparkles,
} from "lucide-react";
import { Product } from "@/types/product";
import {
  FilterOptions,
  FILTER_OPTIONS,
  FeatureKey,
  ProductFilterState,
  buildProductQuery,
} from "@/constants/filters";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterModal, ActiveFilters } from "@/components/home/FilterModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/layout/Container";
import {
  COLLECTIONS,
  CollectionKey,
  normalizeCollectionKey,
  getCollectionLabel,
  getCollectionMeta,
} from "@/lib/collections";
import { fetchProductsPage } from "@/api/products";
import { cn } from "@/lib/utils";

export interface ProductsCatalogProps {
  initialProducts: Product[];
  filterOptions?: FilterOptions;
  initialCollection?: string;
  initialPage?: number;
  totalPages?: number;
  totalElements?: number;
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

function toFilterState(filters: ActiveFilters, sort: SortKey, page: number): ProductFilterState {
  return {
    collection: filters.collections && filters.collections.length > 0 ? filters.collections.join(",") : undefined,
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
    page: Math.max(0, page - 1),
  };
}

export function ProductsCatalog({
  initialProducts,
  filterOptions = FILTER_OPTIONS,
  initialCollection,
  initialPage = 1,
  totalPages: propTotalPages = 1,
  totalElements: propTotalElements = initialProducts.length,
  className,
}: ProductsCatalogProps) {
  const searchParams = useSearchParams();

  // Initialize filters from searchParams or props
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(() => {
    const rawCol = searchParams.get("collection") || searchParams.get("category") || initialCollection;
    const initialCols: string[] = [];
    if (rawCol) {
      const parts = rawCol.split(",");
      for (const part of parts) {
        const normalized = normalizeCollectionKey(part);
        if (normalized && !initialCols.includes(normalized)) {
          initialCols.push(normalized);
        }
      }
    }

    const rawBrands = searchParams.get("brand") || searchParams.get("brands");
    const brands = rawBrands ? rawBrands.split(",").map((b) => b.trim()).filter(Boolean) : [];

    const pricePresetId = searchParams.get("pricePreset") || searchParams.get("pricePresetId") || null;
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;

    const rawOs = searchParams.get("os");
    const os = rawOs ? rawOs.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const rawRam = searchParams.get("ramGb") || searchParams.get("ram");
    const ramGb = rawRam ? rawRam.split(",").map(Number).filter(Boolean) : [];

    const rawRom = searchParams.get("storageGb") || searchParams.get("storage") || searchParams.get("rom");
    const storageGb = rawRom ? rawRom.split(",").map(Number).filter(Boolean) : [];

    const rawResolutions = searchParams.get("resolutions");
    const resolutions = rawResolutions ? rawResolutions.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const rawRefresh = searchParams.get("refreshRates");
    const refreshRates = rawRefresh ? rawRefresh.split(",").map(Number).filter(Boolean) : [];

    const rawCharging = searchParams.get("charging");
    const charging = rawCharging ? rawCharging.split(",").map((s) => s.trim()).filter(Boolean) : [];

    const rawTags = searchParams.get("quickTags") || searchParams.get("tag");
    const quickTags = rawTags ? rawTags.split(",").map((s) => s.trim()).filter(Boolean) : [];

    // Feature toggles
    const features: FeatureKey[] = [];
    (["has5g", "nfc", "ois", "expandableStorage", "headphoneJack", "stereoSpeaker"] as FeatureKey[]).forEach(
      (feat) => {
        if (searchParams.get(feat) === "true") {
          features.push(feat);
        }
      }
    );

    return {
      ...INITIAL_FILTERS,
      collections: initialCols,
      brands,
      pricePresetId,
      minPrice,
      maxPrice,
      os,
      ramGb,
      storageGb,
      resolutions,
      refreshRates,
      charging,
      features,
      quickTags,
    };
  });

  const [sortKey, setSortKey] = useState<SortKey>(() => {
    const rawSort = searchParams.get("sort");
    if (
      rawSort === "popular" ||
      rawSort === "newest" ||
      rawSort === "reviews" ||
      rawSort === "price_asc" ||
      rawSort === "price_desc"
    ) {
      return rawSort;
    }
    return "popular";
  });

  const [currentPage, setCurrentPage] = useState<number>(() => {
    const p = Number(searchParams.get("page"));
    return p && p > 0 ? p : initialPage;
  });

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalPages, setTotalPages] = useState<number>(propTotalPages);
  const [totalElements, setTotalElements] = useState<number>(propTotalElements);
  const [isLoading, setIsLoading] = useState(false);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const isInitialMount = useRef(true);

  // Sync state to URL query parameters without reloading page
  const updateUrl = useCallback(
    (filters: ActiveFilters, sort: SortKey, page: number) => {
      const filterState = toFilterState(filters, sort, page);
      const queryString = buildProductQuery(filterState);
      const newUrl = queryString ? `/products?${queryString}` : "/products";

      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", newUrl);
      }
    },
    []
  );

  // Whenever filters, sort, or page change, query Backend
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    updateUrl(activeFilters, sortKey, currentPage);

    let isMounted = true;
    setIsLoading(true);

    const filterState = toFilterState(activeFilters, sortKey, currentPage);

    fetchProductsPage(filterState)
      .then((res) => {
        if (!isMounted) return;
        if (res.ok) {
          setProducts(res.data.products);
          setTotalElements(res.data.totalElements ?? res.data.products.length);
          setTotalPages(res.data.totalPages ?? 1);
        }
      })
      .catch((err) => {
        console.error("Failed to query products:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeFilters, sortKey, currentPage, updateUrl]);

  // Toggle Collection selection directly
  const handleToggleCollection = (colKey: CollectionKey) => {
    setActiveFilters((prev) => {
      const current = prev.collections || [];
      const exists = current.includes(colKey);
      const updated = exists
        ? current.filter((c) => c !== colKey)
        : [...current, colKey];
      return { ...prev, collections: updated };
    });
    setCurrentPage(1);
  };

  // Toggle Brand in quick chip row
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
    setCurrentPage(1);
  };

  // Toggle quick tag in quick chip row
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
    setCurrentPage(1);
  };

  // Handle Sort selection
  const handleSortClick = (
    key: "popular" | "newest" | "reviews" | "price"
  ) => {
    if (key === "price") {
      setSortKey((prev) => (prev === "price_asc" ? "price_desc" : "price_asc"));
    } else {
      setSortKey(key);
    }
    setCurrentPage(1);
  };

  // Clear all filters
  const handleResetFilters = () => {
    setActiveFilters(INITIAL_FILTERS);
    setSortKey("popular");
    setCurrentPage(1);
  };

  // Remove individual filter chips
  const handleRemoveCollectionChip = (key: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      collections: (prev.collections || []).filter((c) => c !== key),
    }));
    setCurrentPage(1);
  };

  const handleRemoveBrandChip = (brand: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      brands: prev.brands.filter((b) => b !== brand),
    }));
    setCurrentPage(1);
  };

  const handleRemovePriceChip = () => {
    setActiveFilters((prev) => ({
      ...prev,
      pricePresetId: null,
      minPrice: null,
      maxPrice: null,
    }));
    setCurrentPage(1);
  };

  const handleRemoveStringItem = (
    field: "os" | "resolutions" | "charging" | "quickTags",
    val: string
  ) => {
    setActiveFilters((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== val),
    }));
    setCurrentPage(1);
  };

  const handleRemoveNumberItem = (
    field: "ramGb" | "storageGb" | "refreshRates",
    val: number
  ) => {
    setActiveFilters((prev) => ({
      ...prev,
      [field]: prev[field].filter((item) => item !== val),
    }));
    setCurrentPage(1);
  };

  const handleRemoveFeature = (feat: FeatureKey) => {
    setActiveFilters((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feat),
    }));
    setCurrentPage(1);
  };

  // Active filter count
  const activeCount =
    (activeFilters.collections?.length || 0) +
    activeFilters.brands.length +
    (activeFilters.pricePresetId || activeFilters.minPrice || activeFilters.maxPrice ? 1 : 0) +
    activeFilters.os.length +
    activeFilters.ramGb.length +
    activeFilters.storageGb.length +
    activeFilters.refreshRates.length +
    activeFilters.resolutions.length +
    activeFilters.charging.length +
    activeFilters.features.length +
    activeFilters.quickTags.length;

  const validCurrentPage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);

    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = document.getElementById("products-catalog-top");
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  };

  // Derive Context Title and Description
  const activeCollectionKey =
    activeFilters.collections && activeFilters.collections.length === 1
      ? activeFilters.collections[0]
      : null;

  const currentCollectionMeta = activeCollectionKey
    ? getCollectionMeta(activeCollectionKey)
    : null;

  const contextTitle = currentCollectionMeta
    ? currentCollectionMeta.label
    : activeFilters.collections && activeFilters.collections.length > 1
    ? "Điện thoại theo bộ sưu tập"
    : "Tất cả điện thoại";

  const contextDescription = currentCollectionMeta
    ? currentCollectionMeta.description
    : "Danh sách điện thoại thông minh chính hãng với đánh giá ABSA thực tế và bộ lọc thông số chuẩn hóa.";

  return (
    <section id="products-catalog-top" className={cn("py-6 sm:py-8", className)}>
      <Container size="xl" className="space-y-4">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-3">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-brand rounded-xs"
          >
            <Icon icon={Home} size={14} />
            <span>Trang chủ</span>
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/products"
            onClick={(e) => {
              if (activeCount > 0) {
                e.preventDefault();
                handleResetFilters();
              }
            }}
            className={cn(
              "hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-brand rounded-xs",
              !activeCollectionKey && "font-semibold text-ink"
            )}
          >
            Điện thoại
          </Link>
          {currentCollectionMeta && (
            <>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-ink truncate">
                {currentCollectionMeta.label}
              </span>
            </>
          )}
        </nav>

        {/* Category Context Header */}
        <div className="bg-surface border border-line rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-3 border-b border-line">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                  {contextTitle}
                </h1>
                {currentCollectionMeta && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-ai-soft text-ai-ink border border-ai/20">
                    <Icon icon={Sparkles} size={12} />
                    <span>Bộ sưu tập</span>
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-ink-2 mt-1 max-w-2xl">
                {contextDescription}
              </p>
            </div>
            <div className="text-xs sm:text-sm font-medium text-ink-3 shrink-0">
              Tổng cộng <span className="font-bold text-ink">{totalElements}</span> máy
            </div>
          </div>

          {/* 1. Quick Filter Horizontal Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* Funnel "Lọc" button with badge */}
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
              <span>Tất cả bộ lọc</span>
              {activeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-brand text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Collection Chips (4 mục) */}
            {COLLECTIONS.map((col) => {
              const isSelected = (activeFilters.collections || []).includes(col.key);
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => handleToggleCollection(col.key)}
                  aria-pressed={isSelected}
                  className={cn(
                    "inline-flex items-center gap-1 h-9 px-3.5 rounded-full text-xs font-medium shrink-0 cursor-pointer transition-all border",
                    "focus-visible:outline-2 focus-visible:outline-brand",
                    isSelected
                      ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                      : "bg-surface border-line text-ink-2 hover:bg-surface-subtle hover:text-ink"
                  )}
                >
                  {isSelected && <Icon icon={Check} size={13} className="shrink-0" />}
                  <span>{col.label}</span>
                </button>
              );
            })}

            {/* Separator */}
            <div className="h-5 w-px bg-line shrink-0 mx-1" aria-hidden="true" />

            {/* Top Brand Chips */}
            {filterOptions.brands.slice(0, 5).map((brand) => {
              const isSelected = activeFilters.brands.includes(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleToggleBrand(brand)}
                  aria-pressed={isSelected}
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

            {/* Quick tag chips */}
            {filterOptions.quickTags.slice(0, 2).map((tag) => {
              const isSelected = activeFilters.quickTags.includes(String(tag.value));
              return (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => handleToggleTag(String(tag.value))}
                  aria-pressed={isSelected}
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
                className="inline-flex items-center gap-1 text-xs text-ink-3 hover:text-danger px-2 shrink-0 cursor-pointer font-medium"
              >
                <Icon icon={RotateCcw} size={13} />
                <span>Bỏ chọn</span>
              </button>
            )}
          </div>

          {/* 2. Sort Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm border-t border-line/60">
            <span className="font-semibold text-ink-2 mr-1">Sắp xếp theo:</span>

            <button
              type="button"
              onClick={() => handleSortClick("popular")}
              className={cn(
                "px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
                sortKey === "popular"
                  ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
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
                  ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
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
                  ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                  : "bg-surface border-line text-ink-2 hover:bg-surface-subtle"
              )}
            >
              Mới
            </button>

            <button
              type="button"
              onClick={() => handleSortClick("price")}
              className={cn(
                "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium",
                sortKey === "price_asc" || sortKey === "price_desc"
                  ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
                  : "bg-surface border-line text-ink-2 hover:bg-surface-subtle"
              )}
            >
              <span>
                Giá {sortKey === "price_asc" ? "↑" : sortKey === "price_desc" ? "↓" : ""}
              </span>
              <Icon icon={ArrowUpDown} size={13} />
            </button>
          </div>

          {/* 3. Active Filter Badges Bar */}
          {activeCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-line/60">
              <span className="text-xs text-ink-3 mr-1">Đang lọc:</span>

              {/* Collections */}
              {(activeFilters.collections || []).map((colKey) => (
                <span
                  key={colKey}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                >
                  <span>Bộ sưu tập: {getCollectionLabel(colKey)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCollectionChip(colKey)}
                    aria-label={`Bỏ lọc bộ sưu tập ${getCollectionLabel(colKey)}`}
                    className="hover:text-danger cursor-pointer p-0.5"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}

              {/* Brands */}
              {activeFilters.brands.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                >
                  <span>Hãng: {brand}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBrandChip(brand)}
                    aria-label={`Bỏ lọc hãng ${brand}`}
                    className="hover:text-danger cursor-pointer p-0.5"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}

              {/* Price Preset or Custom */}
              {(activeFilters.pricePresetId || activeFilters.minPrice || activeFilters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium">
                  <span>
                    {activeFilters.pricePresetId
                      ? `Giá: ${filterOptions.pricePresets.find((p) => p.id === activeFilters.pricePresetId)?.label}`
                      : activeFilters.minPrice && activeFilters.maxPrice
                      ? `Giá: ${(activeFilters.minPrice / 1e6).toFixed(0)}tr - ${(activeFilters.maxPrice / 1e6).toFixed(0)}tr`
                      : activeFilters.minPrice
                      ? `Giá: Từ ${(activeFilters.minPrice / 1e6).toFixed(0)}tr`
                      : `Giá: Dưới ${(activeFilters.maxPrice! / 1e6).toFixed(0)}tr`}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemovePriceChip}
                    aria-label="Bỏ lọc khoảng giá"
                    className="hover:text-danger cursor-pointer p-0.5"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              )}

              {/* OS */}
              {activeFilters.os.map((val) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                >
                  <span>HĐH: {val === "ios" ? "iPhone (iOS)" : "Android"}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStringItem("os", val)}
                    aria-label={`Bỏ lọc HĐH ${val}`}
                    className="hover:text-danger cursor-pointer p-0.5"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}

              {/* RAM */}
              {activeFilters.ramGb.map((ram) => (
                <span
                  key={ram}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                >
                  <span>RAM: {ram} GB</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNumberItem("ramGb", ram)}
                    aria-label={`Bỏ lọc RAM ${ram} GB`}
                    className="hover:text-danger cursor-pointer p-0.5"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}

              {/* Storages */}
              {activeFilters.storageGb.map((rom) => (
                <span
                  key={rom}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                >
                  <span>Bộ nhớ: {rom >= 1024 ? `${rom / 1024} TB` : `${rom} GB`}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNumberItem("storageGb", rom)}
                    aria-label={`Bỏ lọc bộ nhớ ${rom} GB`}
                    className="hover:text-danger cursor-pointer p-0.5"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}

              {/* Resolutions */}
              {activeFilters.resolutions.map((res) => {
                const label = filterOptions.resolutions.find((r) => r.value === res)?.label || res;
                return (
                  <span
                    key={res}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                  >
                    <span>Màn hình: {label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStringItem("resolutions", res)}
                      aria-label={`Bỏ lọc màn hình ${label}`}
                      className="hover:text-danger cursor-pointer p-0.5"
                    >
                      <Icon icon={X} size={12} />
                    </button>
                  </span>
                );
              })}

              {/* Refresh Rates */}
              {activeFilters.refreshRates.map((rate) => (
                <span
                  key={rate}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                >
                  <span>Tần số quét: {rate} Hz</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNumberItem("refreshRates", rate)}
                    aria-label={`Bỏ lọc tần số quét ${rate} Hz`}
                    className="hover:text-danger cursor-pointer p-0.5"
                  >
                    <Icon icon={X} size={12} />
                  </button>
                </span>
              ))}

              {/* Charging */}
              {activeFilters.charging.map((chg) => {
                const label = filterOptions.chargingOptions.find((c) => c.value === chg)?.label || chg;
                return (
                  <span
                    key={chg}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStringItem("charging", chg)}
                      aria-label={`Bỏ lọc sạc ${label}`}
                      className="hover:text-danger cursor-pointer p-0.5"
                    >
                      <Icon icon={X} size={12} />
                    </button>
                  </span>
                );
              })}

              {/* Features */}
              {activeFilters.features.map((feat) => {
                const label = filterOptions.featureToggles.find((f) => f.value === feat)?.label || feat;
                return (
                  <span
                    key={feat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                  >
                    <span>{label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feat)}
                      aria-label={`Bỏ lọc tính năng ${label}`}
                      className="hover:text-danger cursor-pointer p-0.5"
                    >
                      <Icon icon={X} size={12} />
                    </button>
                  </span>
                );
              })}

              {/* Quick tags */}
              {activeFilters.quickTags.map((tag) => {
                const label = filterOptions.quickTags.find((t) => t.value === tag)?.label || tag;
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-subtle border border-line text-xs text-ink font-medium"
                  >
                    <span>Nhu cầu: {label}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStringItem("quickTags", tag)}
                      aria-label={`Bỏ lọc nhu cầu ${label}`}
                      className="hover:text-danger cursor-pointer p-0.5"
                    >
                      <Icon icon={X} size={12} />
                    </button>
                  </span>
                );
              })}

              {/* Reset all button */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-danger hover:underline ml-1 cursor-pointer font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* 4. Product Results Grid */}
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
        ) : products.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* 5. Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line">
                <span className="text-xs text-ink-3">
                  Trang <span className="font-semibold text-ink">{validCurrentPage}</span> / {totalPages}{" "}
                  (Tổng cộng {totalElements} máy)
                </span>

                <div className="flex items-center gap-1.5" role="navigation" aria-label="Phân trang danh sách sản phẩm">
                  {/* Previous page button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage <= 1}
                    aria-label="Trang trước"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-line bg-surface text-xs font-medium text-ink-2 hover:bg-surface-subtle hover:text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <Icon icon={ChevronLeft} size={15} />
                    <span className="hidden sm:inline">Trang trước</span>
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === validCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        aria-label={`Đến trang ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "w-9 h-9 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center",
                          "focus-visible:outline-2 focus-visible:outline-brand",
                          isActive
                            ? "bg-brand text-ink-inverse border-brand shadow-xs"
                            : "bg-surface border-line text-ink-2 hover:bg-surface-subtle hover:text-ink"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next page button */}
                  <button
                    type="button"
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage >= totalPages}
                    aria-label="Trang sau"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-line bg-surface text-xs font-medium text-ink-2 hover:bg-surface-subtle hover:text-ink disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <span className="hidden sm:inline">Trang sau</span>
                    <Icon icon={ChevronRight} size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface border border-line rounded-2xl p-8 my-6">
            <EmptyState
              title="Không tìm thấy điện thoại phù hợp"
              description="Hãy thử bỏ chọn một số tiêu chí hoặc xóa toàn bộ bộ lọc để xem lại đầy đủ danh sách sản phẩm."
              actionLabel="Xóa tất cả bộ lọc"
              onAction={handleResetFilters}
            />
          </div>
        )}
      </Container>

      {/* Advanced Filter Modal/Drawer with showCollection={true} */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        options={filterOptions}
        activeFilters={activeFilters}
        onChange={(newFilters) => {
          setActiveFilters(newFilters);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
        matchingCount={totalElements}
        showCollection={true}
      />
    </section>
  );
}
