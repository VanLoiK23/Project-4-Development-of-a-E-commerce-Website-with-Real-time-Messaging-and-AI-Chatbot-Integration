import { MOCK_BLOG_POSTS, MOCK_BLOG_CATEGORIES } from "@/mocks/blog";
import { BlogPost, BlogCategory, BlogListResponse } from "@/types/blog";

export interface GetBlogPostsParams {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

/**
 * Data access function for fetching blog posts.
 * Server Components call this directly.
 * Returns { ok: true, data } or { ok: false, error }.
 */
export async function getBlogPosts(
  params: GetBlogPostsParams = {}
): Promise<{ ok: true; data: BlogListResponse } | { ok: false; error: string }> {
  try {
    const { category = "all", search = "", page = 1, pageSize = 6 } = params;

    let filtered = [...MOCK_BLOG_POSTS];

    // Filter by category
    if (category && category !== "all") {
      filtered = filtered.filter(
        (post) => post.categorySlug.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search keyword
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          post.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const validPage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (validPage - 1) * pageSize;
    const paginatedPosts = filtered.slice(startIndex, startIndex + pageSize);

    return {
      ok: true,
      data: {
        posts: paginatedPosts,
        total,
        page: validPage,
        pageSize,
        totalPages,
      },
    };
  } catch {
    return {
      ok: false,
      error: "Không thể tải danh sách bài viết. Vui lòng thử lại sau.",
    };
  }
}

/**
 * Fetch a single blog post by its unique slug.
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<{ ok: true; data: BlogPost } | { ok: false; error: string }> {
  try {
    const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
    if (!post) {
      return { ok: false, error: "Bài viết không tồn tại hoặc đã bị gỡ." };
    }
    return { ok: true, data: post };
  } catch {
    return {
      ok: false,
      error: "Đã xảy ra lỗi khi tải bài viết.",
    };
  }
}

/**
 * Fetch featured blog post for the hero card.
 */
export async function getFeaturedBlogPost(): Promise<
  { ok: true; data: BlogPost | null } | { ok: false; error: string }
> {
  try {
    const featured = MOCK_BLOG_POSTS.find((p) => p.isFeatured) || MOCK_BLOG_POSTS[0] || null;
    return { ok: true, data: featured };
  } catch {
    return { ok: false, error: "Không thể tải bài viết nổi bật." };
  }
}

/**
 * Fetch blog categories with post counts.
 */
export async function getBlogCategories(): Promise<
  { ok: true; data: BlogCategory[] } | { ok: false; error: string }
> {
  try {
    return { ok: true, data: MOCK_BLOG_CATEGORIES };
  } catch {
    return { ok: false, error: "Không thể tải danh mục bài viết." };
  }
}
