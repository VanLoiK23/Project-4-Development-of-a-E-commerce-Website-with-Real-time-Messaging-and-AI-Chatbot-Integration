import React from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Smartphone } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { formatDate } from "@/lib/formatters";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <article
      className={cn(
        "group flex flex-col h-full bg-surface rounded-[var(--radius-lg)] border border-line overflow-hidden shadow-[var(--shadow-none)] hover:shadow-[var(--shadow-md)] hover:border-line transition-all duration-normal",
        className
      )}
    >
      {/* Thumbnail Aspect 16:10 */}
      <Link
        href={`/blog/${post.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block aspect-[16/10] bg-surface-subtle overflow-hidden border-b border-line"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-surface-subtle to-line/30 flex flex-col items-center justify-center p-4 text-center group-hover:scale-105 transition-transform duration-normal">
          <div className="w-10 h-10 rounded-[var(--radius-md)] bg-surface text-brand flex items-center justify-center shadow-[var(--shadow-sm)] mb-2">
            <Icon icon={Smartphone} size={20} />
          </div>
          <span className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
            {post.category}
          </span>
        </div>
      </Link>

      {/* Body Content */}
      <div className="flex flex-col flex-1 p-5 justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-xs text-ink-3">
            <span className="inline-flex items-center gap-1">
              <Icon icon={Calendar} size={13} />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <span aria-hidden="true">•</span>
            <span className="inline-flex items-center gap-1">
              <Icon icon={Clock} size={13} />
              <span>{post.readTimeMinutes} phút</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-ink leading-snug group-hover:text-brand transition-colors line-clamp-2">
            <Link
              href={`/blog/${post.slug}`}
              className="focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] rounded-[var(--radius-sm)]"
            >
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-ink-2 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        {/* Footer Link & Tags */}
        <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-[var(--radius-sm)] bg-surface-subtle text-ink-3"
              >
                #{t}
              </span>
            ))}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-brand hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] rounded-[var(--radius-sm)]"
            aria-label={`Xem chi tiết bài: ${post.title}`}
          >
            <span>Đọc</span>
            <Icon icon={ArrowRight} size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
