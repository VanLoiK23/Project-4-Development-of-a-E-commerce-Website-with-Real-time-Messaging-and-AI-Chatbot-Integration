export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface RelatedPhone {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  absaScore: number;
  topAspect: {
    name: string;
    score: number;
    sentiment: "positive" | "neutral" | "negative";
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  coverImage: string;
  author: BlogAuthor;
  publishedAt: string;
  readTimeMinutes: number;
  isFeatured?: boolean;
  isWeeklyMostRead?: boolean;
  tags: string[];
  relatedPhones?: RelatedPhone[];
}

export interface BlogCategory {
  name: string;
  slug: string;
  count: number;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
