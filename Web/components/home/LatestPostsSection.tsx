import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Post } from "@/types/home";
import { PostCard } from "@/components/blog/PostCard";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface LatestPostsSectionProps {
  posts: Post[];
  className?: string;
}

export function LatestPostsSection({
  posts,
  className,
}: LatestPostsSectionProps) {
  return (
    <section className={cn("py-4 border-t border-line/60", className)}>
      <Container size="xl" className="space-y-1 p-5 bg-white rounded-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-line">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Bài viết & Cẩm nang công nghệ
            </h2>
            <p className="text-xs sm:text-sm text-ink-2">
              Góc nhìn chuyên sâu và dữ liệu thử nghiệm thực tế
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-ink hover:text-brand-hover group shrink-0 transition-colors py-1 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <span>Xem tất cả bài viết</span>
            <Icon
              icon={ArrowRight}
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* 3 Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </section>
  );
}
