import React from "react";
import { cn } from "@/lib/utils";
import { formatVND } from "@/lib/formatters";
import { Badge } from "@/components/ui/Badge";

export interface PriceBlockProps {
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * PriceBlock conforming to component-guidelines.md §3.3.
 * Struck-through price uses text-ink-3. Discount badge uses ui-sale (never AI amber).
 */
export function PriceBlock({
  price,
  originalPrice,
  discountPercent,
  size = "md",
  className,
}: PriceBlockProps) {
  const hasDiscount = originalPrice && originalPrice > price;

  const currentPriceSizes = {
    sm: "text-base font-bold",
    md: "text-lg font-bold sm:text-xl",
    lg: "text-2xl font-bold sm:text-3xl",
  }[size];

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className={cn("text-ink tracking-tight", currentPriceSizes)}>
        {formatVND(price)}
      </span>

      {hasDiscount && (
        <span className="text-xs sm:text-sm text-ink-3 line-through">
          {formatVND(originalPrice)}
        </span>
      )}

      {hasDiscount && discountPercent && discountPercent > 0 && (
        <Badge variant="sale" size="sm">
          -{discountPercent}%
        </Badge>
      )}

      <span className="sr-only">
        Giá hiện tại: {formatVND(price)}
        {hasDiscount && `, Giá gốc: ${formatVND(originalPrice!)}`}
      </span>
    </div>
  );
}
