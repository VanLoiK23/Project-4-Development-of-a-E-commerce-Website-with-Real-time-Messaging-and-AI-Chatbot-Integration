export interface Option<T extends string | number = string> {
  value: T;
  label: string;
}

export interface PricePreset {
  id: string;
  label: string;
  min: number;
  max: number;
}

export interface FilterOptions {
  brands: string[];
  pricePresets: PricePreset[];
  osOptions: Option<"android" | "ios">[];
  ramOptions: Option<number>[];
  storageOptions: Option<number>[];
  resolutions: Option[];
  refreshRates: Option<number>[];
  chargingOptions: Option[];
  featureToggles: Option<FeatureKey>[];
  quickTags: Option[];
}

export type FeatureKey =
  | "has5g"
  | "nfc"
  | "ois"
  | "expandableStorage"
  | "headphoneJack"
  | "stereoSpeaker";

export const FILTER_OPTIONS: FilterOptions = {
  // Phải khớp thuonghieu.tenthuonghieu trong DB (BE so khớp không phân biệt hoa/thường)
  brands: ["SAMSUNG", "iPhone", "Xiaomi", "OPPO", "vivo", "realme", "Google", "ASUS", "NOTHING"],

  pricePresets: [
    { id: "under-2m", label: "Dưới 2 triệu", min: 0, max: 2000000 },
    { id: "2m-4m", label: "Từ 2 - 4 triệu", min: 2000000, max: 4000000 },
    { id: "4m-7m", label: "Từ 4 - 7 triệu", min: 4000000, max: 7000000 },
    { id: "7m-13m", label: "Từ 7 - 13 triệu", min: 7000000, max: 13000000 },
    { id: "13m-20m", label: "Từ 13 - 20 triệu", min: 13000000, max: 20000000 },
    { id: "above-20m", label: "Trên 20 triệu", min: 20000000, max: 100000000 },
  ],

  // thay cho productTypes: chỉ còn 2 giá trị có thật trong specs.os
  osOptions: [
    { value: "android", label: "Android" },
    { value: "ios", label: "iPhone (iOS)" },
  ],

  // lọc theo phiên bản (dungluongram.kichthuocram)
  ramOptions: [4, 6, 8, 12, 16].map((n) => ({ value: n, label: `${n} GB` })),

  // lọc theo phiên bản (dungluongrom.kichthuocrom), 1024 = 1 TB
  storageOptions: [
    { value: 128, label: "128 GB" },
    { value: 256, label: "256 GB" },
    { value: 512, label: "512 GB" },
    { value: 1024, label: "1 TB" },
  ],

  // suy ra từ specs.resolution_w: <1080 | 1080-1199 | 1200-1343 | >=1344
  resolutions: [
    { value: "HD_PLUS", label: "HD+" },
    { value: "FULL_HD_PLUS", label: "Full HD+" },
    { value: "QHD_1_5K", label: "1.5K" },
    { value: "QHD_2K_PLUS", label: "2K+" },
  ],

  refreshRates: [60, 90, 120, 144, 165].map((n) => ({ value: n, label: `${n} Hz` })),

  // specs.charge_w; bỏ "Sạc không dây" vì specs không có trường này
  chargingOptions: [
    { value: "FAST_20W", label: "Sạc nhanh (từ 20W)" },
    { value: "SUPER_FAST_60W", label: "Sạc siêu nhanh (từ 60W)" },
  ],

  // bộ lọc mới, lấy từ các cờ boolean trong specs
  featureToggles: [
    { value: "has5g", label: "Hỗ trợ 5G" },
    { value: "nfc", label: "NFC" },
    { value: "ois", label: "Chống rung quang học (OIS)" },
    { value: "expandableStorage", label: "Hỗ trợ thẻ nhớ" },
    { value: "headphoneJack", label: "Jack tai nghe 3.5mm" },
    { value: "stereoSpeaker", label: "Loa stereo" },
  ],

  // bỏ "Điện thoại AI cao cấp" vì specs không có trường tương ứng
  quickTags: [
    { value: "BATTERY_7000", label: "Pin từ 7000mAh" }, // battery_mah >= 7000
    { value: "CAMERA_200MP", label: "Camera 200MP" }, // rear_main_mp >= 200
    { value: "IP68", label: "Kháng nước IP68" }, // ip_rating IP68/IP69
  ],
};

export interface ProductFilterState {
  keyword?: string;
  collection?: string;
  brands?: string[];
  pricePresetId?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  os?: string[];
  ramGb?: number[];
  storageGb?: number[];
  resolutions?: string[];
  refreshRates?: number[];
  charging?: string[];
  quickTags?: string[];
  features?: FeatureKey[];
  sort?: "popular" | "newest" | "reviews" | "price_asc" | "price_desc";
  page?: number; // 0-based
}

/** Chuyển state bộ lọc thành query string cho GET /api/products */
export function buildProductQuery(state: ProductFilterState): string {
  const p = new URLSearchParams();
  const addAll = (key: string, values?: (string | number)[]) =>
    values?.forEach((v) => p.append(key, String(v)));

  if (state.keyword?.trim()) p.set("keyword", state.keyword.trim());
  if (state.collection?.trim()) p.set("collection", state.collection.trim());
  addAll("brands", state.brands);
  addAll("os", state.os);
  addAll("ramGb", state.ramGb);
  addAll("storageGb", state.storageGb);
  addAll("resolutions", state.resolutions);
  addAll("refreshRates", state.refreshRates);
  addAll("charging", state.charging);
  addAll("quickTags", state.quickTags);
  state.features?.forEach((f) => p.set(f, "true"));

  const preset = FILTER_OPTIONS.pricePresets.find((x) => x.id === state.pricePresetId);
  if (preset) {
    p.set("priceMin", String(preset.min));
    p.set("priceMax", String(preset.max));
  } else {
    if (state.minPrice !== undefined && state.minPrice !== null) {
      p.set("priceMin", String(state.minPrice));
    }
    if (state.maxPrice !== undefined && state.maxPrice !== null) {
      p.set("priceMax", String(state.maxPrice));
    }
  }

  p.set("sort", state.sort ?? "popular");
  p.set("page", String(state.page ?? 0));
  return p.toString();
}
