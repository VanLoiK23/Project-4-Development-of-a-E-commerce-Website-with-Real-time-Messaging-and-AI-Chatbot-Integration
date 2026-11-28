import { Product, StorageVariant, ColorSwatch } from "@/types/product";
import { AspectLeader } from "@/types/absa";

/**
 * Maps Vietnamese color names or arbitrary strings to a suitable visual Tailwind class
 */
export function getColorSwatchClass(colorName?: string): string {
  if (!colorName) return "bg-surface-subtle";
  const lower = colorName.toLowerCase();

  if (lower.includes("titan sa mạc") || lower.includes("sa mạc") || lower.includes("desert")) {
    return "bg-amber-200/80";
  }
  if (lower.includes("titan tự nhiên") || lower.includes("natural")) {
    return "bg-stone-300";
  }
  if (lower.includes("đen") || lower.includes("black") || lower.includes("tối") || lower.includes("dark")) {
    return "bg-slate-900";
  }
  if (lower.includes("trắng") || lower.includes("white")) {
    return "bg-white border border-line";
  }
  if (lower.includes("bạc") || lower.includes("silver") || lower.includes("xám") || lower.includes("grey") || lower.includes("gray")) {
    return "bg-slate-300";
  }
  if (lower.includes("vàng") || lower.includes("gold") || lower.includes("yellow")) {
    return "bg-amber-400";
  }
  if (lower.includes("xanh dương") || lower.includes("xanh biển") || lower.includes("blue")) {
    return "bg-blue-600";
  }
  if (lower.includes("xanh lá") || lower.includes("xanh lục") || lower.includes("green")) {
    return "bg-emerald-600";
  }
  if (lower.includes("tím") || lower.includes("purple") || lower.includes("violet")) {
    return "bg-purple-600";
  }
  if (lower.includes("đỏ") || lower.includes("red")) {
    return "bg-rose-600";
  }
  if (lower.includes("hồng") || lower.includes("pink")) {
    return "bg-pink-300";
  }
  if (lower.includes("cam") || lower.includes("orange")) {
    return "bg-orange-500";
  }
  return "bg-slate-400";
}

/**
 * Transforms a raw Backend ProductResponse into frontend Product interface
 */
export function transformProductResponse(res: any): Product {
  if (!res) {
    throw new Error("Cannot transform empty product response");
  }

  const id = String(res.id ?? "");
  const name = res.name || res.tenSanPham || "";
  const slug = res.slug || res.alias || `product-${id}`;
  const brand = res.brand || res.tenThuongHieu || "";
  const image = res.image || res.hinhAnh || "";
  const price = Number(res.price ?? 0);
  const originalPrice = res.originalPrice ? Number(res.originalPrice) : undefined;
  const discountPercent = res.discountPercent ? Number(res.discountPercent) : 0;
  const soldCount = Number(res.soldCount ?? res.soLuongBan ?? 0);
  const reviewCount = Number(res.reviewCount ?? res.soLuongDanhGia ?? 0);
  const inStock = Boolean(
    res.inStock ?? (res.stockQuantity !== undefined ? res.stockQuantity > 0 : true)
  );

  const collections: string[] = Array.isArray(res.collections)
    ? res.collections
    : [];
  const categoryType = res.categoryType || collections[0] || "mid";

  // Specs
  const keySpecs: string[] =
    Array.isArray(res.keySpecs) && res.keySpecs.length > 0
      ? res.keySpecs
      : [
          res.chipset || "Hiệu năng ổn định",
          res.batteryMah ? `${res.batteryMah} mAh` : "Pin bền bỉ",
          res.refreshHz ? `${res.refreshHz}Hz` : "Màn hình sắc nét",
        ];

  // ABSA
  const absaScore = typeof res.absaOverall?.score === "number" ? res.absaOverall.score : 4.5;
  const absaOverall = {
    score: Math.round(absaScore * 10) / 10,
    sentiment: (res.absaOverall?.sentiment || (absaScore >= 4.0 ? "POSITIVE" : "NEUTRAL")) as any,
  };

  const aspects = Array.isArray(res.aspects)
    ? res.aspects.map((a: any) => ({
        aspectKey: a.aspectKey || a.aspect || "general",
        displayName: a.displayName || a.name || a.aspectKey || "Tổng quan",
        score: typeof a.score === "number" ? Math.round(a.score * 10) / 10 : 4.5,
        sentiment: (a.sentiment || "POSITIVE") as any,
        mentionCount: Number(a.mentionCount ?? a.mentions ?? 50),
        confidence: Number(a.confidence ?? 0.95),
      }))
    : [];

  // Variants grouping by storage/ROM
  const rawVariants = Array.isArray(res.variants) ? res.variants : [];
  let variants: StorageVariant[] = [];

  if (rawVariants.length === 0) {
    variants = [
      {
        id: `v-${id}`,
        storageLabel: "Tiêu chuẩn",
        price,
        originalPrice,
        discountPercent,
        inStock,
        colors: [],
      },
    ];
  } else {
    const storageMap = new Map<string, StorageVariant>();

    for (const v of rawVariants) {
      const storageLabel = v.romLabel || v.storageLabel || "Tiêu chuẩn";
      const colorName = v.colorName || v.tenMauSac || "";
      const colorSwatch: ColorSwatch = {
        key: colorName ? colorName.toLowerCase().replace(/\s+/g, "-") : "default",
        name: colorName || "Mặc định",
        tokenOrClass: getColorSwatchClass(colorName),
      };

      const variantPrice = Number(v.price ?? v.priceSale ?? price);
      const variantOriginalPrice = v.originalPrice ? Number(v.originalPrice) : v.giaXuat ? Number(v.giaXuat) : undefined;
      const variantDiscount = v.discountPercent !== undefined ? Number(v.discountPercent) : discountPercent;
      const variantInStock = Boolean(
        v.inStock ?? (v.stockQuantity !== undefined ? v.stockQuantity > 0 : inStock)
      );

      if (!storageMap.has(storageLabel)) {
        storageMap.set(storageLabel, {
          id: String(v.maPhienBanSP || v.id || `${id}-${storageLabel}`),
          storageLabel,
          price: variantPrice,
          originalPrice: variantOriginalPrice,
          discountPercent: variantDiscount,
          inStock: variantInStock,
          colors: colorName ? [colorSwatch] : [],
        });
      } else {
        const existing = storageMap.get(storageLabel)!;
        if (colorName && !existing.colors.some((c) => c.name === colorName)) {
          existing.colors.push(colorSwatch);
        }
      }
    }

    variants = Array.from(storageMap.values());
  }

  return {
    id,
    slug,
    name,
    brand,
    categoryType,
    image,
    price,
    originalPrice,
    discountPercent,
    soldCount,
    keySpecs,
    specsFilter: res.specsFilter || {},
    absaOverall,
    reviewCount,
    aspects,
    collections,
    variants,
    inStock,
  };
}

/**
 * Transforms Spring Page / PagedModel response or List into standard paginated structure
 */
export function transformProductPage(pageRes: any): {
  products: Product[];
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
} {
  if (!pageRes) {
    return { products: [], page: 0, totalPages: 0, totalElements: 0, size: 8 };
  }

  let content: any[] = [];
  if (Array.isArray(pageRes)) {
    content = pageRes;
  } else if (Array.isArray(pageRes.content)) {
    content = pageRes.content;
  } else if (pageRes._embedded && Array.isArray(pageRes._embedded.productResponseList)) {
    content = pageRes._embedded.productResponseList;
  } else if (pageRes.data && Array.isArray(pageRes.data.content)) {
    content = pageRes.data.content;
  } else if (pageRes.data && Array.isArray(pageRes.data)) {
    content = pageRes.data;
  }

  const products = content.map(transformProductResponse);

  // Pagination metadata
  const pageMeta = pageRes.page || pageRes.data?.page || {};
  const totalElements = Number(
    pageMeta.totalElements ?? pageRes.totalElements ?? products.length
  );
  const totalPages = Number(
    pageMeta.totalPages ?? pageRes.totalPages ?? (totalElements > 0 ? Math.ceil(totalElements / 8) : 0)
  );
  const page = Number(pageMeta.number ?? pageRes.number ?? 0);
  const size = Number(pageMeta.size ?? pageRes.size ?? 8);

  return {
    products,
    page,
    totalPages,
    totalElements,
    size,
  };
}

/**
 * Builds aspect leaders for AbsaHighlightsSection from products with ABSA data
 */
export function buildAspectLeaders(products: Product[]): AspectLeader[] {
  const ASPECT_CONFIG = [
    { key: "battery", name: "Thời lượng pin" },
    { key: "camera", name: "Camera & Chụp ảnh" },
    { key: "performance", name: "Hiệu năng & Tản nhiệt" },
  ];

  return ASPECT_CONFIG.map(({ key, name }) => {
    // Find products that have this aspect or sort by overall ABSA
    const ranked = [...products]
      .map((p) => {
        const aspect = p.aspects.find(
          (a) => a.aspectKey.toLowerCase().includes(key) || key.includes(a.aspectKey.toLowerCase())
        );
        return {
          product: p,
          score: aspect ? aspect.score : p.absaOverall.score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);

    return {
      aspectKey: key,
      displayName: name,
      products: ranked.slice(0, 3),
    };
  });
}
