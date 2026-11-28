import React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Newspaper, Flame, RefreshCcw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { FeaturedPostCard } from "@/components/blog/FeaturedPostCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCategoryFilter } from "@/components/blog/BlogCategoryFilter";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";
import { Skeleton } from "@/components/ui/Skeleton";
import { getBlogPosts, getFeaturedBlogPost, getBlogCategories } from "@/api/blog";

export const metadata: Metadata = {
  title: "Tin tức & Đánh giá công nghệ thực tế (ABSA)",
  description:
    "Cập nhật các bài phân tích smartphone chuyên sâu dựa trên đánh giá thực tế của cộng đồng theo từng khía cạnh phần cứng: pin, camera, hiệu năng, màn hình.",
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
    q?: string;
  }>;
}

function BlogLoading() {
  return (
    <div className="py-8 sm:py-12 space-y-12" role="status" aria-label="Đang tải bài viết">
      <Container size="xl">
        <div className="max-w-3xl mx-auto space-y-4 text-center">
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-full max-w-2xl mx-auto" />
        </div>
      </Container>
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-[var(--radius-xl)]" />
          ))}
        </div>
      </Container>
    </div>
  );
}

async function BlogContent({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "all";
  const currentPage = Number(params.page) || 1;
  const searchQuery = params.q || "";

  // Fetch data via typed API functions
  const [categoriesRes, featuredRes, postsRes] = await Promise.all([
    getBlogCategories(),
    getFeaturedBlogPost(),
    getBlogPosts({
      category: currentCategory,
      search: searchQuery,
      page: currentPage,
      pageSize: 6,
    }),
  ]);

  const categories = categoriesRes.ok ? categoriesRes.data : [];
  const featuredPost = featuredRes.ok ? featuredRes.data : null;
  const postData = postsRes.ok ? postsRes.data : null;

  return (
    <div className="py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section aria-labelledby="blog-main-heading">
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-surface border border-line text-xs font-semibold text-ink-2 shadow-[var(--shadow-sm)]">
              <Icon icon={Sparkles} size={14} className="text-ai" />
              <span>Góc nhìn công nghệ minh bạch</span>
            </div>

            <h1
              id="blog-main-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-ink font-heading"
            >
              Bài viết & Đánh giá thực tế
            </h1>

            <p className="text-sm sm:text-base text-ink-2 leading-relaxed">
              Khám phá các bài phân tích smartphone khách quan, đối chiếu thông số hãng với phản hồi cộng đồng (ABSA) và cẩm nang chọn máy tối ưu cho từng nhu cầu.
            </p>
          </div>
        </Container>
      </section>

      {/* Featured Post Hero (Only show when on first page with no category filter or all) */}
      {featuredPost && currentCategory === "all" && currentPage === 1 && !searchQuery && (
        <section aria-label="Bài viết nổi bật nhất">
          <Container size="xl">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-2">
                <Icon icon={Flame} size={16} className="text-ai" />
                <span>Tiêu điểm tuần này</span>
              </div>
              <FeaturedPostCard post={featuredPost} />
            </div>
          </Container>
        </section>
      )}

      {/* Filter & Main Grid Section */}
      <section aria-labelledby="articles-list-heading">
        <Container size="xl" className="space-y-8">
          {/* Header of Section + Category Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-4">
            <div className="space-y-1">
              <h2 id="articles-list-heading" className="text-xl sm:text-2xl font-bold text-ink">
                {currentCategory === "all" ? "Tất cả bài viết" : `Chuyên mục: ${currentCategory}`}
              </h2>
              <p className="text-xs text-ink-3">
                Tổng cộng {postData?.total || 0} bài viết phân tích
              </p>
            </div>

            <BlogCategoryFilter
              categories={categories}
              activeCategory={currentCategory}
            />
          </div>

          {/* Data States Handling: Loading, Empty, Error */}
          {!postsRes.ok ? (
            <div
              role="alert"
              className="p-8 text-center rounded-[var(--radius-xl)] bg-surface border border-line space-y-4"
            >
              <p className="text-danger font-medium text-sm">
                {postsRes.error || "Không thể tải dữ liệu bài viết."}
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-brand text-ink-inverse text-sm font-semibold hover:bg-brand-hover"
              >
                <Icon icon={RefreshCcw} size={16} />
                <span>Thử lại</span>
              </Link>
            </div>
          ) : postData && postData.posts.length === 0 ? (
            <div className="p-12 text-center rounded-[var(--radius-xl)] bg-surface border border-line space-y-3">
              <div className="w-12 h-12 rounded-[var(--radius-full)] bg-surface-subtle text-ink-3 flex items-center justify-center mx-auto">
                <Icon icon={Newspaper} size={24} />
              </div>
              <h3 className="text-base font-bold text-ink">Không tìm thấy bài viết phù hợp</h3>
              <p className="text-xs text-ink-2 max-w-sm mx-auto">
                Chuyên mục này hiện chưa có bài viết nào hoặc từ khóa tìm kiếm không khớp.
              </p>
              <Link
                href="/blog"
                className="inline-block mt-2 text-xs font-semibold text-brand underline underline-offset-4"
              >
                Quay lại xem tất cả bài viết
              </Link>
            </div>
          ) : (
            <>
              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {postData?.posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {postData && postData.totalPages > 1 && (
                <div
                  role="navigation"
                  aria-label="Phân trang danh sách bài viết"
                  className="flex items-center justify-center gap-2 pt-6"
                >
                  {Array.from({ length: postData.totalPages }, (_, i) => i + 1).map((p) => {
                    const isCurrent = p === postData.page;
                    const pageHref = `/blog?category=${currentCategory}&page=${p}`;

                    return (
                      <Link
                        key={p}
                        href={pageHref}
                        className={`w-9 h-9 flex items-center justify-center text-xs font-semibold rounded-[var(--radius-md)] border transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] ${
                          isCurrent
                            ? "bg-brand text-ink-inverse border-brand"
                            : "bg-surface text-ink-2 border-line hover:bg-surface-subtle"
                        }`}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        {p}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      {/* Newsletter Section */}
      <section aria-label="Đăng ký nhận thông tin công nghệ">
        <Container size="xl">
          <BlogNewsletter />
        </Container>
      </section>
    </div>
  );
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  return (
    <Suspense fallback={<BlogLoading />}>
      <BlogContent searchParams={searchParams} />
    </Suspense>
  );
}
