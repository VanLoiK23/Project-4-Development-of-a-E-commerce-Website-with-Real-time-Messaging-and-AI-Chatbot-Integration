import { Product, FilterOptions } from "./product";
import { AspectLeader } from "./absa";

export interface RecommendationReason {
  aspectKey: string;
  text: string; // e.g. "Pin 4.7/5 · hợp với điều bạn hay xem"
}

export interface Recommendation {
  product: Product;
  matchPercent: number; // e.g. 95 -> 95%
  reasons: RecommendationReason[];
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  publishedAt: string; // ISO string
  category: string;
}

export interface SlideItem {
  id: number;
  image: string;
  trash?: string;
  status?: number;
  deletedAt?: string | null;
  title?: string;
  subtitle?: string;
  linkHref?: string;
}

export interface HomeData {
  collections: {
    flagship: Product[];
    upperMid: Product[];
    mid: Product[];
    gaming: Product[];
  };
  allProducts: Product[];
  aspectLeaders: AspectLeader[];
  posts: Post[];
  filterOptions: FilterOptions;
  slides: SlideItem[];
}
