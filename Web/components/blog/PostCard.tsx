import React from "react";
import Link from "next/link";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import { Post } from "@/types/home";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

export interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article
      className={cn(
        "flex flex-col bg-surface border border-line rounded-xl overflow-hidden group",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-brand/20",
        className
      )}
    >
      <div className="relative aspect-video w-full bg-surface-subtle flex items-center justify-center overflow-hidden border-b border-line">
        <div className="text-ink-3 group-hover:scale-110 transition-transform duration-300">
          {post.cover ? (
            <img
              src={post.cover}
              alt={post.title}
              className="h-full w-full object-cover rounded-lg"
            />
          ) : (
            <Icon icon={BookOpen} size={36} />
          )}
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-brand text-ink-inverse">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1.5 text-xs text-ink-3 mb-2.5">
          <Icon icon={Calendar} size={13} />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>

        <h3 className="text-base font-semibold text-ink line-clamp-2 mb-2 group-hover:text-brand-hover transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`} className="focus-visible:outline-2 focus-visible:outline-brand rounded-sm">
            {post.title}
          </Link>
        </h3>

        <p className="text-sm text-ink-2 line-clamp-2 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="pt-3 border-t border-line/60">
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-ink hover:text-brand transition-colors group/btn"
          >
            <span>Đọc bài viết</span>
            <Icon
              icon={ArrowRight}
              size={14}
              className="group-hover/btn:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
