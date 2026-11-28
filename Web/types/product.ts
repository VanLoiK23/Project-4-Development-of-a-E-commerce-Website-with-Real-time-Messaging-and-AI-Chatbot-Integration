import { AspectScore, SentimentType } from "./absa";
import { PricePreset, FilterOptions } from "@/constants/filters";

export type { PricePreset, FilterOptions };

export interface ColorSwatch {
  key: string;
  name: string;
  tokenOrClass: string; // Tailwind class or token alias, NEVER raw HEX
}

export interface StorageVariant {
  id: string;
  storageLabel: string; // e.g. "256 GB", "512 GB", "1 TB"
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  inStock: boolean;
  colors: ColorSwatch[];
}

export interface SpecsFilter {
  ramGb?: number; // e.g. 8, 12, 16
  storageGb?: number; // e.g. 256, 512, 1024
  refreshHz?: number; // e.g. 60, 90, 120, 144, 165
  resolution?: string; // e.g. "Full HD+", "1.5K", "2K+", "Retina (iPhone)"
  chargingTier?: string; // e.g. "Sạc nhanh (từ 20W)", "Sạc siêu nhanh (từ 60W)", "Sạc không dây"
  productType?: string; // e.g. "iPhone (iOS)", "Android", "Điện thoại AI", "Điện thoại gập"
  highlights?: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryType: string; // "flagship" | "upperMid" | "mid" | "gaming"
  image: string; // Local SVG/WebP placeholder path
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  soldCount: number; // e.g. 3300 -> "Đã bán 3,3k", 134 -> "Đã bán 134"
  keySpecs: string[]; // e.g. ["Snapdragon 8 Gen 3", "5000 mAh", "120Hz"]
  specsFilter: SpecsFilter;
  absaOverall: {
    score: number;
    sentiment: SentimentType;
  };
  reviewCount: number;
  aspects: AspectScore[];
  collections: string[];
  variants: StorageVariant[];
  inStock: boolean;
}
