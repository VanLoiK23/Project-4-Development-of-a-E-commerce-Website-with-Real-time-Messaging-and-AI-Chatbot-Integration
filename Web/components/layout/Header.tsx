"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Smartphone,
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Sparkles,
  GitCompare,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Headphones,
  HomeIcon,
  Book,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/context/AuthContext";

export interface HeaderProps {
  cartItemCount?: number;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentProps<typeof Icon>["icon"];
  badge?: string;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: "/", icon: HomeIcon },
  { label: "Điện thoại", href: "/products", icon: Smartphone },
  { label: "Bài viết", href: "/blog", icon: BookOpen },
  { label: "Về chúng tôi", href: "/about", icon: Book },
];

const MOBILE_CATEGORIES: { label: string; href: string }[] = [
  { label: "Tất cả smartphone", href: "/products" },
  { label: "Flagship cao cấp", href: "/products?category=flagship" },
  { label: "Tầm trung thực dụng", href: "/products?category=tam-trung" },
  { label: "Điện thoại pin khủng (ABSA ≥ 4.0)", href: "/products?aspect=pin" },
  { label: "Camera sắc nét (ABSA ≥ 4.0)", href: "/products?aspect=camera" },
];

const MOBILE_SUPPORT_LINKS: { label: string; href: string; icon: React.ComponentProps<typeof Icon>["icon"] }[] = [
  { label: "Chính sách bảo hành", href: "/policies/warranty", icon: ShieldCheck },
  { label: "Đổi trả 30 ngày", href: "/policies/return", icon: RotateCcw },
  { label: "Hỗ trợ & Liên hệ", href: "/contact", icon: Headphones },
];

/**
 * Global Header component conforming to:
 * - component-guidelines.md §2.1 (Header), §2.2 (Main Nav), §2.3 (Search Bar)
 * - design-tokens.md §1 (Brand & Foundation colors), §6 (Focus tokens), §11 (Z-index)
 * - design-decisions.md §1.2 & §2 (Amber reserved for AI with charcoal text; on-dark white focus ring)
 */
export function Header({ cartItemCount = 0, className }: HeaderProps) {
  const pathname = usePathname();
  const authContext = useAuth();
  const auth = authContext?.auth ?? { isAuthenticated: false, user: null };

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  // Close drawers when navigating to a new route (adjust state during render)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileNavOpen(false);
    setIsMobileSearchOpen(false);
  }

  // Handle focus return and body scroll lock when mobile drawer opens/closes
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
      // Focus first focusable element inside drawer
      const timer = setTimeout(() => {
        if (mobileDrawerRef.current) {
          const firstFocusable = mobileDrawerRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          firstFocusable?.focus();
        }
      }, 50);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobileNavOpen]);

  // Autofocus mobile search input when mobile search bar expands
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Handle Escape key to close mobile drawer or mobile search bar
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isMobileNavOpen) {
          setIsMobileNavOpen(false);
          hamburgerButtonRef.current?.focus();
        } else if (isMobileSearchOpen) {
          setIsMobileSearchOpen(false);
        }
      }
    },
    [isMobileNavOpen, isMobileSearchOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleCloseDrawer = () => {
    setIsMobileNavOpen(false);
    hamburgerButtonRef.current?.focus();
  };

  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[1100] w-full bg-brand text-ink-inverse on-dark border-b border-brand-hover shadow-sm",
          className
        )}
      >
        <Container size="xl">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-3 lg:gap-6">
            {/* Left: Mobile Hamburger & Brand Logo */}
            <div className="flex items-center gap-2 lg:gap-3 shrink-0">
              {/* Hamburger Button (Mobile / Tablet < 1024px) */}
              <button
                ref={hamburgerButtonRef}
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-md text-ink-inverse hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-150 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Mở menu điều hướng di động"
                aria-expanded={isMobileNavOpen}
                aria-controls="mobile-navigation-drawer"
              >
                <Icon icon={Menu} size={22} />
              </button>

              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 group rounded-md p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Phone Store - Trang chủ"
              >
                <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-md bg-brand-hover border border-white/10 flex items-center justify-center text-ink-inverse group-hover:border-white/30 transition-colors">
                  <Icon icon={Smartphone} size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base lg:text-lg tracking-tight text-ink-inverse leading-none">
                    PHONE<span className="font-extrabold ml-0.5 text-ink-inverse/90">STORE</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Center-Left: Desktop Main Navigation (>= 1024px) */}
            <nav
              aria-label="Điều hướng chính"
              className="hidden lg:flex items-center gap-1 xl:gap-2"
            >
              {MAIN_NAV_ITEMS.map((item) => {
                const active = isRouteActive(item.href);
                const isAiItem = item.href === "/recommendation";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 relative flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      active
                        ? "text-ink-inverse font-semibold after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-white"
                        : "text-white/80 hover:text-ink-inverse hover:bg-brand-hover/60"
                    )}
                  >
                    {item.icon && (
                      <Icon
                        icon={item.icon}
                        size={16}
                        className={isAiItem ? "text-ai" : "text-white/70"}
                      />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (AI CTA, Search icon for mobile, Cart, Account) */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative p-2 rounded-md text-ink-inverse hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={`Giỏ hàng${cartItemCount > 0 ? `, ${cartItemCount} sản phẩm` : ""}`}
              >
                <Icon icon={ShoppingCart} size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ai text-ink text-[11px] font-bold flex items-center justify-center leading-none">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              <Link
                href={auth.isAuthenticated ? "/account" : "/login"}
                className="p-2 rounded-md text-ink-inverse hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center gap-1.5"
                aria-label={auth.isAuthenticated ? `Tài khoản (${auth.user?.name || "Người dùng"})` : "Đăng nhập tài khoản"}
              >
                <Icon icon={User} size={20} />
                <span className="hidden lg:inline text-xs font-medium text-white/90 max-w-[90px] truncate">
                  {auth.isAuthenticated ? auth.user?.name || "Tài khoản" : "Tài khoản"}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Overlay Bar (< 1024px, when toggled) */}
          {isMobileSearchOpen && (
            <div className="lg:hidden pb-3 pt-1 border-t border-brand-hover animate-in fade-in slide-in-from-top-1 duration-150">
              <form
                action="/search"
                method="GET"
                role="search"
                className="flex items-center gap-2"
                onSubmit={() => setIsMobileSearchOpen(false)}
              >
                <label htmlFor="header-search-mobile" className="sr-only">
                  Tìm kiếm smartphone theo tên hoặc nhu cầu
                </label>
                <div className="relative flex-1">
                  <Icon
                    icon={Search}
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none"
                  />
                  <input
                    ref={mobileSearchInputRef}
                    id="header-search-mobile"
                    name="q"
                    type="search"
                    placeholder="Tìm máy: pin trâu, camera, gaming..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 text-sm bg-brand-hover text-ink-inverse placeholder:text-white/50 rounded-lg border border-white/20 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-ink-inverse text-xs font-semibold shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Tìm
                </button>
              </form>
            </div>
          )}
        </Container>
      </header>

      {/* Mobile Navigation Drawer Backdrop scrim */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-brand/70 backdrop-blur-xs z-[1200] lg:hidden transition-opacity duration-200"
          onClick={handleCloseDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer (< 1024px) */}
      <div
        id="mobile-navigation-drawer"
        ref={mobileDrawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-brand text-ink-inverse on-dark z-[1250] lg:hidden flex flex-col shadow-2xl transition-transform duration-300 ease-in-out border-r border-brand-hover",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        )}
      >
        {/* Drawer Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-brand-hover shrink-0">
          <Link
            href="/"
            onClick={handleCloseDrawer}
            className="flex items-center gap-2"
            aria-label="Phone Store - Trang chủ"
          >
            <div className="w-8 h-8 rounded-md bg-brand-hover border border-white/10 flex items-center justify-center text-ink-inverse">
              <Icon icon={Smartphone} size={18} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight text-ink-inverse">
              PHONE<span className="text-ai font-extrabold ml-0.5">STORE</span>
            </span>
          </Link>

          <button
            type="button"
            onClick={handleCloseDrawer}
            className="p-2 -mr-2 rounded-md text-white/80 hover:text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Đóng menu điều hướng"
          >
            <Icon icon={X} size={22} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* AI Recommendation Banner in Drawer */}
          <div className="p-3.5 rounded-xl bg-brand-hover/80 border border-ai/30 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ai">
              <Icon icon={Sparkles} size={16} className="text-ai" />
              <span>Gợi ý cá nhân hóa AI</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Khám phá smartphone phù hợp nhất dựa trên lịch sử xem và đánh giá ABSA thực tế.
            </p>
            <Link
              href="/recommendation"
              onClick={handleCloseDrawer}
              className="w-full min-h-[44px] px-3 rounded-md bg-ai text-ink font-semibold text-xs tracking-wide hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Icon icon={Sparkles} size={15} className="text-ink" />
              <span>Khám phá ngay</span>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase block mb-2 px-2">
              Điều hướng chính
            </span>
            <nav aria-label="Menu điều hướng di động" className="space-y-1">
              {MAIN_NAV_ITEMS.map((item) => {
                const active = isRouteActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleCloseDrawer}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                      active
                        ? "bg-brand-hover text-ink-inverse font-semibold"
                        : "text-white/80 hover:bg-brand-hover/60 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon && <Icon icon={item.icon} size={18} className="text-white/70" />}
                      <span>{item.label}</span>
                    </div>
                    <Icon icon={ChevronRight} size={16} className="text-white/40" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Categories */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase block mb-2 px-2">
              Khám phá danh mục
            </span>
            <div className="space-y-1">
              {MOBILE_CATEGORIES.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  onClick={handleCloseDrawer}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-brand-hover/60 hover:text-white transition-colors min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>{cat.label}</span>
                  <Icon icon={ChevronRight} size={14} className="text-white/30" />
                </Link>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-white/50 uppercase block mb-2 px-2">
              Chính sách & Hỗ trợ
            </span>
            <div className="space-y-1">
              {MOBILE_SUPPORT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleCloseDrawer}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-brand-hover/60 hover:text-white transition-colors min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Icon icon={link.icon} size={16} className="text-white/50" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Account Area */}
        <div className="p-4 border-t border-brand-hover bg-brand-hover/40 shrink-0">
          {auth.isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-ink-inverse">
                  <Icon icon={User} size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-medium text-ink-inverse truncate">
                    {auth.user?.name || "Khách hàng"}
                  </span>
                  <span className="text-[11px] text-white/50 truncate">
                    {auth.user?.email || ""}
                  </span>
                </div>
              </div>
              <Link
                href="/account"
                onClick={handleCloseDrawer}
                className="w-full min-h-[44px] flex items-center justify-center text-xs font-semibold px-3 py-2 rounded-md bg-brand-hover hover:bg-white/10 text-ink-inverse border border-white/10 transition-colors"
              >
                Vào trung tâm tài khoản
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={handleCloseDrawer}
                className="min-h-[44px] flex items-center justify-center text-xs font-semibold px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-ink-inverse transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={handleCloseDrawer}
                className="min-h-[44px] flex items-center justify-center text-xs font-semibold px-3 py-2 rounded-md bg-ai text-ink hover:bg-brand-accent-hover transition-colors"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
