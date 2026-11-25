"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Sparkles,
  Smartphone,
  FileText,
  Info,
  PhoneCall,
  Scale,
  ShieldCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface HeaderProps {
  cartCount?: number;
  userName?: string | null;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  isAi?: boolean;
}

const mainNavItems: NavItem[] = [
  { label: "Điện thoại", href: "/products", icon: Smartphone },
  { label: "So sánh", href: "/compare", icon: Scale },
  { label: "Gợi ý AI", href: "/recommendation", icon: Sparkles, isAi: true },
  { label: "Bài viết", href: "/blog", icon: FileText },
  { label: "Giới thiệu", href: "/about", icon: Info },
];

export function Header({ cartCount = 0, userName = null, className }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Adjust state during render when pathname changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sticky shadow elevation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close drawer or search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileSearchOpen) {
          setMobileSearchOpen(false);
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, mobileSearchOpen]);

  // Focus input when mobile search is opened
  useEffect(() => {
    if (mobileSearchOpen) {
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 50);
    }
  }, [mobileSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <>
      {/* Semantic Charcoal Header */}
      <header
        className={cn(
          "sticky top-0 z-[var(--z-sticky)] w-full bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] transition-shadow duration-normal",
          isScrolled ? "shadow-[var(--shadow-md)] border-b border-[var(--color-brand-hover)]" : "border-b border-[var(--color-brand-hover)]",
          className
        )}
      >
        <Container size="xl">
          <div className="flex items-center justify-between h-14 lg:h-16 gap-2 lg:gap-4 xl:gap-6">
            {/* Mobile: Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-[var(--radius-md)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2"
                aria-label="Mở menu điều hướng"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
              >
                <Icon icon={Menu} size={22} />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-base lg:text-lg xl:text-xl tracking-tight text-[var(--color-text-inverse)] hover:opacity-90 rounded-[var(--radius-sm)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2"
                aria-label="Phone Store - Trang chủ"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] border border-[var(--color-border-default)]/20 text-[var(--color-text-inverse)]">
                  <Icon icon={Smartphone} size={18} />
                </span>
                <span className="font-heading">
                  Phone<span className="text-[var(--color-brand-accent)]">Store</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation (>= 1024px) */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0"
              aria-label="Điều hướng chính"
            >
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

                if (item.isAi) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium rounded-[var(--radius-full)] transition-colors",
                        "bg-[var(--color-brand-hover)] border border-[var(--color-brand-accent)]/40 text-[var(--color-text-inverse)]",
                        "hover:border-[var(--color-brand-accent)] hover:bg-[var(--color-brand-hover)]/80",
                        "focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2",
                        isActive && "ring-1 ring-[var(--color-brand-accent)]"
                      )}
                    >
                      <Icon
                        icon={Sparkles}
                        size={14}
                        className="text-[var(--color-brand-accent)]"
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-2 xl:px-3 py-1.5 text-xs xl:text-sm font-medium transition-opacity rounded-[var(--radius-sm)]",
                      "focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2",
                      isActive
                        ? "text-[var(--color-text-inverse)] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[var(--color-text-inverse)]"
                        : "text-[var(--color-text-inverse)]/85 hover:text-[var(--color-text-inverse)] hover:opacity-100"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Search Bar (>= 1024px) */}
            <div className="hidden lg:flex flex-1 min-w-[140px] max-w-[200px] xl:max-w-xs">
              <form onSubmit={handleSearchSubmit} className="relative w-full" role="search">
                <label htmlFor="desktop-header-search" className="sr-only">
                  Tìm kiếm smartphone theo tên hoặc tiêu chí ABSA
                </label>
                <div className="relative flex items-center">
                  <input
                    ref={searchInputRef}
                    id="desktop-header-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm điện thoại, pin, camera..."
                    className="w-full h-9 pl-9 pr-4 text-xs xl:text-sm bg-[var(--color-brand-input)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] rounded-[var(--radius-full)] border border-transparent focus:border-[var(--color-brand-accent)] focus:bg-[var(--color-brand-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2 transition-colors"
                  />
                  <span className="absolute left-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
                    <Icon icon={Search} size={15} />
                  </span>
                </div>
              </form>
            </div>

            {/* Right Utilities (Search Trigger on Mobile, Cart, Account) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search Trigger (< 1024px) */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-[var(--radius-md)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2"
                aria-label="Mở tìm kiếm"
                aria-expanded={mobileSearchOpen}
              >
                <Icon icon={Search} size={20} />
              </button>

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center p-2 rounded-[var(--radius-md)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2"
                aria-label={`Giỏ hàng, hiện có ${cartCount} sản phẩm`}
              >
                <Icon icon={ShoppingCart} size={20} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[11px] font-bold leading-none flex items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-ui-sale)] text-[var(--color-text-inverse)]"
                    aria-hidden="true"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Account Link / Login CTA */}
              <Link
                href={userName ? "/account" : "/login"}
                className="inline-flex items-center gap-2 p-2 rounded-[var(--radius-md)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2 text-sm font-medium"
                aria-label={userName ? `Tài khoản: ${userName}` : "Đăng nhập tài khoản"}
              >
                <Icon icon={User} size={20} />
                {userName ? (
                  <span className="hidden xl:inline max-w-[120px] truncate text-xs font-semibold">
                    {userName}
                  </span>
                ) : (
                  <span className="hidden xl:inline text-xs font-medium">
                    Tài khoản
                  </span>
                )}
              </Link>
            </div>
          </div>
        </Container>

        {/* Mobile Search Overlay Input (< 1024px) */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-[var(--color-brand-hover)] bg-[var(--color-brand-primary)] px-4 py-3">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center" role="search">
              <label htmlFor="mobile-header-search" className="sr-only">
                Tìm kiếm điện thoại
              </label>
              <input
                ref={mobileSearchInputRef}
                id="mobile-header-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm điện thoại, pin, camera..."
                className="w-full h-10 pl-10 pr-10 text-sm bg-[var(--color-brand-input)] text-[var(--color-text-inverse)] placeholder:text-[var(--color-text-muted)] rounded-[var(--radius-md)] border border-transparent focus:border-[var(--color-brand-accent)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-2"
              />
              <span className="absolute left-3 text-[var(--color-text-muted)] pointer-events-none">
                <Icon icon={Search} size={18} />
              </span>
              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="absolute right-2 p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                aria-label="Đóng tìm kiếm"
              >
                <Icon icon={X} size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Backdrop & Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[var(--z-drawer)] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu điều hướng di động">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div
            id="mobile-navigation-drawer"
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-[var(--color-brand-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-xl)] flex flex-col z-[var(--z-drawer)]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-brand-hover)]">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-bold text-lg text-[var(--color-text-inverse)]"
                aria-label="Về trang chủ"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] border border-[var(--color-border-default)]/20">
                  <Icon icon={Smartphone} size={18} />
                </span>
                <span className="font-heading">
                  Phone<span className="text-[var(--color-brand-accent)]">Store</span>
                </span>
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
                aria-label="Đóng menu điều hướng"
              >
                <Icon icon={X} size={22} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1" aria-label="Danh mục di động">
              {mainNavItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                const ItemIcon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-3 py-3 rounded-[var(--radius-md)] text-base font-medium transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]",
                      item.isAi && "border border-[var(--color-brand-accent)]/30 bg-[var(--color-brand-hover)]/40",
                      isActive
                        ? "bg-[var(--color-brand-hover)] text-[var(--color-text-inverse)] font-semibold"
                        : "text-[var(--color-text-inverse)]/85 hover:bg-[var(--color-brand-hover)] hover:text-[var(--color-text-inverse)]"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <div className="flex items-center gap-3">
                      {ItemIcon && (
                        <Icon
                          icon={ItemIcon}
                          size={20}
                          className={item.isAi ? "text-[var(--color-brand-accent)]" : "text-[var(--color-text-muted)]"}
                        />
                      )}
                      <span>{item.label}</span>
                    </div>
                    <Icon icon={ChevronRight} size={16} className="text-[var(--color-text-muted)]" />
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-[var(--color-brand-hover)] space-y-1">
                <Link
                  href="/policies/bao-hanh"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)]"
                >
                  <Icon icon={ShieldCheck} size={18} />
                  <span>Chính sách bảo hành</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-hover)]"
                >
                  <Icon icon={PhoneCall} size={18} />
                  <span>Liên hệ hỗ trợ</span>
                </Link>
              </div>
            </nav>

            {/* Drawer Footer Account CTA */}
            <div className="p-4 border-t border-[var(--color-brand-hover)] bg-[var(--color-brand-primary)]">
              <Link
                href={userName ? "/account" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--color-brand-hover)] hover:bg-[var(--color-brand-hover)]/80 text-[var(--color-text-inverse)] text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring-inverse)]"
              >
                <Icon icon={User} size={18} />
                <span>{userName ? "Trang cá nhân" : "Đăng nhập / Đăng ký"}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
