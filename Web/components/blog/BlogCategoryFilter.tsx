import React from "react";
import Link from "next/link";
import { BlogCategory } from "@/types/blog";
import { cn } from "@/lib/utils";

export interface BlogCategoryFilterProps {
  categories: BlogCategory[];
  activeCategory?: string;
  className?: string;
}

export function BlogCategoryFilter({
  categories,
  activeCategory = "all",
  className,
}: BlogCategoryFilterProps) {
  return (
    <div
      role="navigation"
      aria-label="Lọc chuyên mục bài viết"
      className={cn("flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none", className)}
    >
      {categories.map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.slug.toLowerCase();
        const href = cat.slug === "all" ? "/blog" : `/blog?category=${cat.slug}`;

        return (
          <Link
            key={cat.slug}
            href={href}
            className={cn(
              "shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-full)] text-xs sm:text-sm font-medium transition-colors border",
              "focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)]",
              isActive
                ? "bg-brand text-ink-inverse border-brand shadow-[var(--shadow-sm)]"
                : "bg-surface text-ink-2 border-line hover:border-brand hover:text-ink hover:bg-surface-subtle"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <span>{cat.name}</span>
            {cat.count > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-[var(--radius-full)] text-[10px] font-semibold leading-none",
                  isActive ? "bg-brand-hover text-ink-inverse" : "bg-surface-subtle text-ink-3"
                )}
              >
                {cat.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
