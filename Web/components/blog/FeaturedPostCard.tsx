import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, Sparkles, Newspaper } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface FeaturedPostCardProps {
  post: BlogPost;
  className?: string;
}

export function FeaturedPostCard({ post, className }: FeaturedPostCardProps) {
  return (
    <article
      className={cn(
        "group relative grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8 bg-surface rounded-[var(--radius-xl)] border border-line shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-normal",
        className
      )}
    >
      {/* Cover Image Container */}
      <div className="lg:col-span-6 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[380px] w-full rounded-[var(--radius-lg)] overflow-hidden bg-surface-subtle border border-line flex items-center justify-center">
        {/* Placeholder Graphic for Blog Cover */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-subtle to-line/40 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-[var(--radius-full)] bg-surface flex items-center justify-center shadow-[var(--shadow-sm)] mb-3 text-brand">
            <Icon icon={Newspaper} size={28} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-2">
            Bài viết tiêu điểm
          </span>
          <span className="text-sm font-medium text-ink mt-1 max-w-xs line-clamp-2">
            {post.category}
          </span>
        </div>

        {/* Badge Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-full)] bg-brand text-ink-inverse text-xs font-semibold shadow-[var(--shadow-sm)]">
          <Icon icon={Sparkles} size={14} className="text-ai" />
          <span>Nổi bật</span>
        </div>
      </div>

      {/* Post Content Details */}
      <div className="lg:col-span-6 flex flex-col justify-between space-y-4 py-2">
        <div className="space-y-3">
          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs text-ink-3">
            <span className="inline-flex items-center gap-1">
              <Icon icon={Calendar} size={14} />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <Icon icon={Clock} size={14} />
              <span>{post.readTimeMinutes} phút đọc</span>
            </span>
            <span aria-hidden="true">•</span>
            <span className="font-medium text-ink-2 px-2 py-0.5 rounded-[var(--radius-sm)] bg-surface-subtle">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-ink group-hover:text-brand transition-colors line-clamp-3">
            <Link
              href={`/blog/${post.slug}`}
              className="focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] rounded-[var(--radius-sm)]"
            >
              {post.title}
            </Link>
          </h2>

          {/* Excerpt */}
          <p className="text-sm sm:text-base text-ink-2 leading-relaxed line-clamp-3 sm:line-clamp-4">
            {post.excerpt}
          </p>
        </div>

        {/* Footer info: tags & read CTA */}
        <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-[var(--radius-full)] bg-surface-subtle text-ink-2 border border-line"
              >
                #{tag}
              </span>
            ))}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] rounded-[var(--radius-sm)] shrink-0"
            aria-label={`Đọc bài viết: ${post.title}`}
          >
            <span>Đọc tiếp</span>
            <Icon icon={ArrowRight} size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
