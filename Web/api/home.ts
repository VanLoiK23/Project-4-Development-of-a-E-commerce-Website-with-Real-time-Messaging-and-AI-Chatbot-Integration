import { HomeData, Recommendation, Post, SlideItem } from "@/types/home";
import { Product } from "@/types/product";
import { FILTER_OPTIONS } from "@/constants/filters";
import {
  transformProductPage,
  transformProductResponse,
  buildAspectLeaders,
} from "@/lib/adapters/product";

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

interface FetchOptions {
  state?: "loading" | "error" | "default";
  profile?: "ready" | "cold";
}

export function getApiBaseUrl(): string {
  let url =
    (typeof window === "undefined"
      ? process.env.BACKEND_INTERNAL_URL || process.env.NEXT_PUBLIC_BACKEND_URL
      : process.env.NEXT_PUBLIC_BACKEND_URL) || "http://localhost:8080/api/";
  if (!url.endsWith("/")) {
    url += "/";
  }
  return url;
}

/**
 * Fetches homepage data (catalog, collections, slides, posts, aspect leaders, filterOptions).
 * Connects directly to Backend HomeController endpoints:
 * - GET /api/products
 * - GET /api/slide
 * - GET /api/blog
 */
export async function getHomeData(
  options: FetchOptions = {}
): Promise<ApiResponse<HomeData>> {
  if (options.state === "error") {
    return {
      ok: false,
      error: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
    };
  }

  const baseUrl = getApiBaseUrl();

  try {
    // 1. Fetch catalog products (page 0, limit 8 as configured in BE)
    const productsPromise = fetch(`${baseUrl}products?sort=popular&page=0`, {
      cache: "no-store",
    }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} from /api/products`);

      return res.json();
    });

    // 2. Fetch slides from /api/slide
    const slidesPromise = fetch(`${baseUrl}slide`, {
      cache: "no-store",
    }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} from /api/slide`);
      return res.json();
    });

    // 3. Fetch posts from /api/blog
    const postsPromise = fetch(`${baseUrl}blog?page=1&limit=3&sortBy=createAt`, {
      cache: "no-store",
    }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} from /api/blog`);
      return res.json();
    });

    // 4. Fetch curated collections
    const collectionsPromise = Promise.all([
      fetch(`${baseUrl}products?collection=flagship&page=0`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${baseUrl}products?collection=upperMid&page=0`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${baseUrl}products?collection=mid&page=0`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
      fetch(`${baseUrl}products?collection=gaming&page=0`, { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]);

    const [productsRaw, slidesRaw, postsRaw, collectionsRaw] = await Promise.allSettled([
      productsPromise,
      slidesPromise,
      postsPromise,
      collectionsPromise,
    ]);

    console.log(productsRaw)

    // Parse products
    const parsedProducts =
      productsRaw.status === "fulfilled"
        ? transformProductPage(productsRaw.value).products
        : [];

    // Parse slides
    const rawSlidesList =
      slidesRaw.status === "fulfilled" && Array.isArray(slidesRaw.value)
        ? slidesRaw.value
        : [];
    const slides: SlideItem[] = rawSlidesList.map((s: any) => ({
      id: Number(s.id),
      image: s.image || "",
      trash: s.trash || "active",
      status: Number(s.status ?? 1),
      deletedAt: s.deletedAt ?? null,
      title: s.title || `Khuyến mãi hot #${s.id}`,
      subtitle: s.subtitle || "Khám phá ngay ưu đãi công nghệ tốt nhất",
      linkHref: s.linkHref || "/products",
    }));

    // Parse posts from /api/blog
    const rawPostsList =
      postsRaw.status === "fulfilled" && Array.isArray(postsRaw.value)
        ? postsRaw.value
        : [];
    const posts: Post[] = rawPostsList.map((p: any) => ({
      id: String(p.id ?? ""),
      slug: p.slug || `post-${p.id}`,
      title: p.title || "Tin tức công nghệ",
      excerpt: p.excerpt || p.sortDesc || "",
      cover: p.cover || p.image || "/images/blog/battery-test.webp",
      publishedAt: p.publishedAt || p.createAt || new Date().toISOString(),
      category: p.category || "Công nghệ",
    }));

    // Parse collections
    let flagshipProds: Product[] = [];
    let upperMidProds: Product[] = [];
    let midProds: Product[] = [];
    let gamingProds: Product[] = [];

    if (collectionsRaw.status === "fulfilled" && collectionsRaw.value) {
      const [f, u, m, g] = collectionsRaw.value;
      if (f) flagshipProds = transformProductPage(f).products;
      if (u) upperMidProds = transformProductPage(u).products;
      if (m) midProds = transformProductPage(m).products;
      if (g) gamingProds = transformProductPage(g).products;
    }

    // Fallback collections from parsedProducts if empty
    if (flagshipProds.length === 0) {
      flagshipProds = parsedProducts.filter((p) => p.collections.includes("flagship") || p.categoryType === "flagship");
    }
    if (upperMidProds.length === 0) {
      upperMidProds = parsedProducts.filter((p) => p.collections.includes("upperMid") || p.categoryType === "upperMid");
    }
    if (midProds.length === 0) {
      midProds = parsedProducts.filter((p) => p.collections.includes("mid") || p.categoryType === "mid");
    }
    if (gamingProds.length === 0) {
      gamingProds = parsedProducts.filter((p) => p.collections.includes("gaming") || p.categoryType === "gaming");
    }

    const aspectLeaders = buildAspectLeaders(parsedProducts);

    return {
      ok: true,
      data: {
        collections: {
          flagship: flagshipProds,
          upperMid: upperMidProds,
          mid: midProds,
          gaming: gamingProds,
        },
        allProducts: parsedProducts,
        aspectLeaders,
        posts,
        filterOptions: FILTER_OPTIONS,
        slides,
      },
    };
  } catch (error: any) {
    console.error("Failed to load home data from backend:", error);
    return {
      ok: false,
      error: error?.message || "Không thể kết nối đến máy chủ Backend.",
    };
  }
}

/**
 * Fetches recommendations for the "Dành cho bạn" rail.
 * Calls backend endpoint GET /api/products/recomment.
 * If not implemented or fails, gracefully returns an empty list.
 */
export async function getRecommendations(
  options: FetchOptions = {}
): Promise<ApiResponse<Recommendation[]>> {
  if (options.state === "error") {
    return {
      ok: false,
      error: "Không thể tải danh sách gợi ý.",
    };
  }

  const baseUrl = getApiBaseUrl();

  try {
    // Attempt to call /api/products/recomment (or fallback to /api/products/recommend)
    const res = await fetch(`${baseUrl}products/recomment`, {
      cache: "no-store",
    }).catch(() => null);

    if (!res || !res.ok) {
      // Backend endpoint might not be ready yet: gracefully return empty array
      return {
        ok: true,
        data: [],
      };
    }

    const data = await res.json();
    const rawList = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];

    const recommendations: Recommendation[] = rawList.map((item: any) => {
      const prodData = item.product || item;
      return {
        product: transformProductResponse(prodData),
        matchPercent: Number(item.matchPercent || 92),
        reasons: Array.isArray(item.reasons)
          ? item.reasons
          : [
            {
              aspectKey: "overall",
              text: "Được AI chọn lọc phù hợp với nhu cầu",
            },
          ],
      };
    });

    return {
      ok: true,
      data: recommendations,
    };
  } catch (err) {
    // Return empty array if not ready
    return {
      ok: true,
      data: [],
    };
  }
}
