import { Product, FilterOptions } from "@/types/product";
import {
  FILTER_OPTIONS,
  ProductFilterState,
  buildProductQuery,
} from "@/constants/filters";
import { transformProductPage } from "@/lib/adapters/product";
import { getApiBaseUrl } from "@/api/home";

export interface ProductsData {
  products: Product[];
  filterOptions: FilterOptions;
  page?: number;
  totalPages?: number;
  totalElements?: number;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface FetchOptions {
  state?: "loading" | "error" | "default";
}

/**
 * Fetches paginated products and filter options from backend GET /api/products
 */
export async function getProductsData(
  options: FetchOptions = {},
  filterState: ProductFilterState = {}
): Promise<ApiResponse<ProductsData>> {
  if (options.state === "error") {
    return {
      ok: false,
      error: "Không thể kết nối đến máy chủ. Vui lòng bấm thử lại sau.",
    };
  }

  const baseUrl = getApiBaseUrl();
  const query = buildProductQuery(filterState);

  try {
    const res = await fetch(`${baseUrl}products?${query}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from /api/products`);
    }

    const data = await res.json();
    const parsed = transformProductPage(data);

    return {
      ok: true,
      data: {
        products: parsed.products,
        filterOptions: FILTER_OPTIONS,
        page: parsed.page,
        totalPages: parsed.totalPages,
        totalElements: parsed.totalElements,
      },
    };
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    return {
      ok: false,
      error: error?.message || "Không thể tải danh sách sản phẩm từ máy chủ.",
    };
  }
}

/**
 * Helper to fetch a product page directly from client-side or server
 */
export async function fetchProductsPage(
  filterState: ProductFilterState
): Promise<ApiResponse<ProductsData>> {
  return getProductsData({}, filterState);
}
