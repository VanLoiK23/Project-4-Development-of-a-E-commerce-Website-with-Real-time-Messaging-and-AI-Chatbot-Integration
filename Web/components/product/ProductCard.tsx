"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, GitCompare, Check } from "lucide-react";
import { Product, StorageVariant, ColorSwatch } from "@/types/product";
import { PhonePlaceholder } from "@/mocks/phone-placeholder";
import { AspectScorePill } from "@/components/absa/AspectScorePill";
import { PriceBlock } from "@/components/product/PriceBlock";
import { MatchScoreBadge } from "@/components/recommendation/MatchScoreBadge";
import { formatSoldCount } from "@/lib/formatters";
import { useCompare } from "@/hooks/use-compare";
import { useFavorites } from "@/hooks/use-favorites";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: Product;
  matchPercent?: number; // Optional personalization match score
  className?: string;
}

/**
 * ProductCard conforming to component-guidelines.md §3.1 and user reference images.
 * Includes heart favorite toggle, storage variant selector, color swatches,
 * ABSA rating + soldCount, and Compare toggle button.
 */
export function ProductCard({
  product,
  matchPercent,
  className,
}: ProductCardProps) {
  const { isInCompare, addToCompare } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedVariant, setSelectedVariant] = useState<StorageVariant>(
    product.variants[0] || {
      id: "default",
      storageLabel: "256 GB",
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercent: product.discountPercent,
      inStock: product.inStock,
      colors: [],
    }
  );

  const [selectedColor, setSelectedColor] = useState<ColorSwatch | undefined>(
    selectedVariant.colors[0]
  );

  const isFavorited = isFavorite(product.id);
  const isCompared = isInCompare(product.id);

  const handleSelectVariant = (e: React.MouseEvent, variant: StorageVariant) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariant(variant);
    setSelectedColor(variant.colors[0]);
  };

  const handleSelectColor = (e: React.MouseEvent, color: ColorSwatch) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColor(color);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(
      product,
      selectedVariant.storageLabel,
      selectedColor?.name
    );
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col bg-surface border border-line rounded-xl overflow-hidden hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {/* Top action row: Badges on left, Heart on right */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 items-start pointer-events-auto">
          {matchPercent !== undefined && matchPercent > 0 && (
            <MatchScoreBadge matchPercent={matchPercent} />
          )}
        </div>

        {/* Heart Favorite Button */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-pressed={isFavorited}
          aria-label={
            isFavorited
              ? `Bỏ lưu sản phẩm ${product.name}`
              : `Lưu sản phẩm ${product.name}`
          }
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center transition-colors pointer-events-auto",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            isFavorited
              ? "bg-danger-soft text-danger"
              : "bg-surface/85 text-ink-3 hover:text-danger hover:bg-surface border border-line/60"
          )}
        >
          <Icon
            icon={Heart}
            size={18}
            className={cn(isFavorited && "fill-current text-danger")}
          />
        </button>
      </div>

      {/* Main product link wrapping visual & title */}
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-1 p-4 pb-0 focus-visible:outline-2 focus-visible:outline-brand rounded-t-xl"
      >
        {/* Phone 1:1 Image Container */}
        <div className="w-full aspect-square mb-3 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <PhonePlaceholder brand={product.brand} name={product.name} />
          )}
        </div>

        {/* Hardware micro-chips row */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {product.keySpecs.map((spec, i) => (
            <span
              key={i}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-subtle text-ink-2 truncate max-w-[140px]"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Product Title */}
        <h3 className="text-sm sm:text-base font-semibold text-ink line-clamp-2 min-h-[44px] group-hover:text-brand-hover transition-colors leading-snug">
          {product.name}
        </h3>
      </Link>

      {/* Interactive variant & color controls (outside <a>) */}
      <div className="px-4 py-2 space-y-2.5">
        {/* Storage variant pills */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Chọn dung lượng">
            {product.variants.map((v) => {
              const active = v.id === selectedVariant.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={(e) => handleSelectVariant(e, v)}
                  className={cn(
                    "text-xs px-2.5 py-1 rounded-md transition-colors cursor-pointer border",
                    "focus-visible:outline-2 focus-visible:outline-brand",
                    active
                      ? "bg-brand text-ink-inverse border-brand font-medium"
                      : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                  )}
                >
                  {v.storageLabel}
                </button>
              );
            })}
          </div>
        )}

        {/* Color swatches */}
        {selectedVariant.colors && selectedVariant.colors.length > 0 && (
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Chọn màu sắc">
            {selectedVariant.colors.map((color) => {
              const active = selectedColor?.key === color.key;
              return (
                <button
                  key={color.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={(e) => handleSelectColor(e, color)}
                  title={color.name}
                  className={cn(
                    "w-5 h-5 rounded-full border transition-all cursor-pointer relative flex items-center justify-center",
                    color.tokenOrClass,
                    active
                      ? "border-brand ring-2 ring-brand/30 scale-110"
                      : "border-line hover:scale-105"
                  )}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              );
            })}
            {selectedColor && (
              <span className="text-[11px] text-ink-3 truncate max-w-[100px] ml-1">
                {selectedColor.name}
              </span>
            )}
          </div>
        )}

        {/* Price Row */}
        <PriceBlock
          price={selectedVariant.price}
          originalPrice={selectedVariant.originalPrice}
          discountPercent={selectedVariant.discountPercent}
          size="sm"
        />

        {/* Rating and Sold count */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-line/50">
          <AspectScorePill
            score={product.absaOverall.score}
            size="sm"
          />
          <span className="text-[11px] text-ink-3 font-medium">
            {formatSoldCount(product.soldCount)}
          </span>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-4 pt-2 mt-auto border-t border-line/60 flex items-center justify-between gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="text-xs font-semibold text-ink-2 hover:text-ink underline-offset-4 hover:underline py-1"
        >
          Chi tiết
        </Link>

        {/* Compare button */}
        <button
          type="button"
          onClick={handleToggleCompare}
          aria-pressed={isCompared}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer border",
            "focus-visible:outline-2 focus-visible:outline-brand",
            isCompared
              ? "bg-brand text-ink-inverse border-brand font-semibold shadow-xs"
              : "bg-surface border-line text-ink-2 hover:bg-surface-subtle hover:text-ink"
          )}
        >
          <Icon
            icon={isCompared ? Check : GitCompare}
            size={14}
            className={isCompared ? "text-ink-inverse" : "text-ink-2"}
          />
          <span>{isCompared ? "Đã thêm so sánh" : "+ So sánh"}</span>
        </button>
      </div>
    </article>
  );
}
