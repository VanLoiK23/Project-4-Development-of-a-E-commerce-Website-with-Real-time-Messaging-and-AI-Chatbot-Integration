"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Smartphone,
  GitCompare,
  BookOpen,
  Info,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ComponentProps<typeof Icon>["icon"];
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Điện thoại", href: "/products", icon: Smartphone },
  { label: "So sánh", href: "/compare", icon: GitCompare },
  { label: "Bài viết", href: "/blog", icon: BookOpen },
  { label: "Về chúng tôi", href: "/about", icon: Info },
  { label: "Tài khoản", href: "/account", icon: User },
];

/**
 * Mobile Navigation (Bottom Nav Bar) conforming to component-guidelines.md §2.4.
 * Visible on all viewports below 1024px (hidden on lg+).
 * 6 items: Trang chủ, Điện thoại, So sánh, Bài viết, Về chúng tôi, Tài khoản.
 */
export function BottomNav() {
  const pathname = usePathname();
  const authContext = useAuth();
  const auth = authContext?.auth ?? { isAuthenticated: false, user: null };

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label="Điều hướng di động"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[1100] h-14 bg-surface/95 backdrop-blur-md border-t border-line shadow-lg"
    >
      <div className="grid grid-cols-6 h-full max-w-lg mx-auto px-1">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const targetHref =
            item.href === "/account" && !auth.isAuthenticated
              ? "/login"
              : item.href;
          const active = isItemActive(item.href);

          return (
            <Link
              key={item.href}
              href={targetHref}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors relative",
                "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand",
                active ? "text-brand font-semibold" : "text-ink-2 hover:text-ink"
              )}
            >
              <div className="relative">
                <Icon
                  icon={item.icon}
                  size={19}
                  className={cn(active ? "text-brand" : "text-ink-2")}
                />
                {active && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className="text-[10px] leading-tight mt-0.5 truncate max-w-full px-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
