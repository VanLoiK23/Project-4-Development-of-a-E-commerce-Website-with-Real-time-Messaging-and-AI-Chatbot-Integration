import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  User,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { RelatedPhones } from "@/components/blog/RelatedPhones";
import { BlogCard } from "@/components/blog/BlogCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { getBlogPostBySlug, getBlogPosts } from "@/api/blog";
import { formatDate } from "@/lib/formatters";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const res = await getBlogPostBySlug(slug);

  if (!res.ok) {
    return {
      title: "Bài viết không tìm thấy | Phone Store",
    };
  }

  return {
    title: `${res.data.title} | Phone Store Blog`,
    description: res.data.excerpt,
  };
}

function BlogPostLoading() {
  return (
    <article className="py-8 sm:py-12 space-y-10" role="status" aria-label="Đang tải bài viết">
      <Container size="md" className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </Container>
      <Container size="lg">
        <Skeleton className="aspect-[16/9] w-full rounded-[var(--radius-xl)]" />
      </Container>
      <Container size="md" className="space-y-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </Container>
    </article>
  );
}

async function BlogPostContent({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const res = await getBlogPostBySlug(slug);

  if (!res.ok || !res.data) {
    notFound();
  }

  const post = res.data;

  // Fetch related articles in same category
  const relatedPostsRes = await getBlogPosts({
    category: post.categorySlug,
    pageSize: 3,
  });
  const relatedPosts = (relatedPostsRes.ok ? relatedPostsRes.data.posts : []).filter(
    (p) => p.slug !== post.slug
  );

  return (
    <article className="py-8 sm:py-12 space-y-10">
      {/* Breadcrumb Navigation */}
      <Container size="md">
        <nav aria-label="Đường dẫn bài viết" className="flex items-center gap-1.5 text-xs text-ink-3">
          <Link
            href="/"
            className="hover:text-ink hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]"
          >
            Trang chủ
          </Link>
          <Icon icon={ChevronRight} size={12} />
          <Link
            href="/blog"
            className="hover:text-ink hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]"
          >
            Blog
          </Link>
          <Icon icon={ChevronRight} size={12} />
          <span className="text-ink truncate max-w-[200px] sm:max-w-xs" aria-current="page">
            {post.title}
          </span>
        </nav>
      </Container>

      {/* Article Header */}
      <Container size="md" className="space-y-6">
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 rounded-[var(--radius-full)] bg-surface border border-line text-xs font-semibold text-ink-2 shadow-[var(--shadow-sm)]">
            {post.category}
          </span>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink font-heading leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-ink-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Author & Publishing Metadata Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-line text-xs text-ink-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[var(--radius-full)] bg-surface-subtle border border-line flex items-center justify-center text-ink">
              <Icon icon={User} size={18} />
            </div>
            <div>
              <p className="font-semibold text-ink text-sm">{post.author.name}</p>
              <p className="text-ink-3">{post.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Icon icon={Calendar} size={14} />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Icon icon={Clock} size={14} />
              <span>{post.readTimeMinutes} phút đọc</span>
            </span>
          </div>
        </div>
      </Container>

      {/* Featured Cover Display */}
      <Container size="lg">
        <div className="relative aspect-[16/9] rounded-[var(--radius-xl)] bg-surface-subtle border border-line overflow-hidden flex items-center justify-center text-center p-8">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-[var(--radius-full)] bg-surface text-brand flex items-center justify-center mx-auto shadow-[var(--shadow-sm)]">
              <Icon icon={Sparkles} size={22} className="text-ai" />
            </div>
            <p className="text-xs uppercase tracking-widest text-ink-3 font-semibold">
              Ảnh minh họa chuyên mục {post.category}
            </p>
            <h2 className="text-lg font-bold text-ink max-w-md mx-auto line-clamp-2">
              {post.title}
            </h2>
          </div>
        </div>
      </Container>

      {/* Article Rich Text Body (--container-md) */}
      <Container size="md">
        <div
          className="prose prose-slate max-w-none text-ink text-base sm:text-lg leading-relaxed space-y-6 [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:text-ink [&>h2]:pt-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Related Phones Widget with ABSA Scores */}
        {post.relatedPhones && post.relatedPhones.length > 0 && (
          <RelatedPhones phones={post.relatedPhones} />
        )}

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-line">
          <span className="text-xs font-semibold text-ink-3">Chủ đề:</span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-[var(--radius-full)] bg-surface-subtle text-ink-2 border border-line"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Back Link */}
        <div className="pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]"
          >
            <Icon icon={ArrowLeft} size={16} />
            <span>Quay lại trang tin tức</span>
          </Link>
        </div>
      </Container>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section aria-labelledby="related-posts-heading" className="pt-8 border-t border-line">
          <Container size="xl" className="space-y-6">
            <h2 id="related-posts-heading" className="text-xl sm:text-2xl font-bold text-ink">
              Bài viết cùng chuyên mục
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}

export default function BlogPostDetailPage({ params }: BlogPostPageProps) {
  return (
    <Suspense fallback={<BlogPostLoading />}>
      <BlogPostContent params={params} />
    </Suspense>
  );
}
