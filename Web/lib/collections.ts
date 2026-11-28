import { Product } from "@/types/product";

export type CollectionKey = "flagship" | "upperMid" | "mid" | "gaming";

export interface CollectionMeta {
  key: CollectionKey;
  label: string;
  description: string;
  aliases: string[];
}

export const COLLECTIONS: CollectionMeta[] = [
  {
    key: "flagship",
    label: "Flagship cao cấp",
    description: "Công nghệ tiên phong, camera đỉnh cao và hoàn thiện sang trọng bậc nhất",
    aliases: ["flagship", "Flagship cao cấp", "cao-cap", "flagships"],
  },
  {
    key: "upperMid",
    label: "Cận cao cấp",
    description: "Trải nghiệm tiệm cận flagship với hiệu năng mạnh mẽ và mức giá tối ưu",
    aliases: ["upperMid", "upper-mid", "Cận cao cấp", "can-cao-cap"],
  },
  {
    key: "mid",
    label: "Tầm trung thực dụng",
    description: "Pin bền bỉ, màn hình đẹp, đáp ứng mượt mà mọi tác vụ hàng ngày",
    aliases: ["mid", "Tầm trung thực dụng", "tam-trung", "pho-thong"],
  },
  {
    key: "gaming",
    label: "Gaming chuyên sâu",
    description: "Tần số quét cao, tản nhiệt buồng hơi vượt trội và hiệu năng không giật lag",
    aliases: ["gaming", "Gaming chuyên sâu", "chuyen-gaming", "game"],
  },
];

/**
 * Normalizes any collection string/alias to canonical CollectionKey
 */
export function normalizeCollectionKey(input: string): CollectionKey | null {
  if (!input) return null;
  const normalized = input.trim().toLowerCase();
  for (const c of COLLECTIONS) {
    if (
      c.key.toLowerCase() === normalized ||
      c.label.toLowerCase() === normalized ||
      c.aliases.some((a) => a.toLowerCase() === normalized)
    ) {
      return c.key;
    }
  }
  return null;
}

/**
 * Gets human-readable label for a collection key
 */
export function getCollectionLabel(keyOrLabel: string): string {
  const key = normalizeCollectionKey(keyOrLabel);
  const found = COLLECTIONS.find((c) => c.key === key);
  return found ? found.label : keyOrLabel;
}

/**
 * Gets meta details for a collection key
 */
export function getCollectionMeta(keyOrLabel: string): CollectionMeta | undefined {
  const key = normalizeCollectionKey(keyOrLabel);
  return COLLECTIONS.find((c) => c.key === key);
}

/**
 * Matches a product to a collection key with fallback
 */
export function matchesCollection(product: Product, collectionKeyOrLabel: string): boolean {
  const key = normalizeCollectionKey(collectionKeyOrLabel);
  if (!key) return false;

  // 1. Direct match on collections array or categoryType
  if (product.collections?.includes(key)) return true;
  if (product.categoryType?.toLowerCase() === key.toLowerCase()) return true;

  // 2. Fallback matching rules to ensure every category always has products:
  switch (key) {
    case "flagship":
      return (
        product.price >= 25000000 ||
        product.categoryType === "flagship" ||
        product.specsFilter.highlights?.some((h) =>
          h.toLowerCase().includes("cao cấp") || h.toLowerCase().includes("ai")
        ) ||
        false
      );

    case "upperMid":
      return (
        product.categoryType === "upperMid" ||
        (product.price >= 13000000 && product.price < 25000000) ||
        product.specsFilter.productType?.toLowerCase().includes("ai") ||
        false
      );

    case "mid":
      return (
        product.categoryType === "mid" ||
        product.price < 13000000 ||
        product.name.toLowerCase().includes("a55") ||
        product.name.toLowerCase().includes("redmi") ||
        false
      );

    case "gaming":
      return (
        product.categoryType === "gaming" ||
        (product.specsFilter.refreshHz !== undefined && product.specsFilter.refreshHz >= 144) ||
        product.name.toLowerCase().includes("rog") ||
        product.name.toLowerCase().includes("gaming") ||
        product.keySpecs.some((s) => s.toLowerCase().includes("165hz") || s.toLowerCase().includes("tản nhiệt")) ||
        false
      );

    default:
      return false;
  }
}
