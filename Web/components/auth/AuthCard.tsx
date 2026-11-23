"use client";

/**
 * AuthCard.tsx – Split Card layout cho S10 (Login) & S11 (Register).
 *
 * Layout:
 *   Desktop (lg+): 2 cột 50/50 – Visual panel và Form panel.
 *   Mobile (<lg): Xếp dọc – strip trên, form bên dưới.
 *
 * Sliding Animation:
 *   Khi chuyển mode login ↔ register:
 *   - Visual Panel ở bên trái lướt nhẹ sang bên phải (translate-x-full).
 *   - Form Panel ở bên phải lướt nhẹ sang bên trái (-translate-x-full).
 *   - Hai bên đổi chỗ mượt mà với cubic-bezier curve.
 *   - Form bên trong crossfade sang Login/Register tương ứng.
 */

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AuthMode } from "@/types/auth";

interface AuthCardProps {
  /** Mode hiện tại – dùng để kiểm soát animation và layout */
  mode: AuthMode;
  /** Callback khi người dùng bấm chuyển sang mode kia */
  onModeChange?: (mode: AuthMode) => void;
  loginForm?: React.ReactNode;
  registerForm?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** Nội dung minh hoạ thương mại điện tử cho từng chế độ */
const VISUAL_CONTENT: Record<
  AuthMode,
  {
    heading: string;
    tagline: string;
    badge: string;
    image: string;
    imageAlt: string;
    tagTop: string;
    tagBottom: string;
  }
> = {
  login: {
    heading: "Chào mừng trở lại!",
    tagline:
      "Khám phá gợi ý smartphone cá nhân hóa dựa trên sở thích thực sự của bạn.",
    badge: "🤖 AI Recommendation",
    image: "/images/ecommerce-3d.jpg",
    imageAlt: "Thương mại điện tử - Mua sắm smartphone với AI",
    tagTop: "⚡ Flash Deal -30%",
    tagBottom: "⭐ 4.9/5 · Phone Store",
  },
  register: {
    heading: "Tham gia Phone Store",
    tagline:
      "Tạo tài khoản để nhận voucher mua sắm và theo dõi đơn hàng công nghệ độc quyền.",
    badge: "🎁 Ưu đãi thành viên mới",
    image: "/images/ecommerce-3d-2.jpg",
    imageAlt: "Thương mại điện tử - Ưu đãi smartphone độc quyền",
    tagTop: "🎁 Voucher 500k",
    tagBottom: "🚀 Giao nhanh 2h",
  },
};

export function AuthCard({
  mode,
  onModeChange,
  loginForm,
  registerForm,
  children,
  className,
}: AuthCardProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const visual = VISUAL_CONTENT[mode];

  return (
    <div
      className={cn(
        "w-full max-w-[960px] mx-auto relative overflow-hidden",
        "bg-surface rounded-2xl border border-line",
        "shadow-[0_8px_32px_-8px_var(--color-brand-primary,#1e1e24)26,0_2px_8px_-2px_var(--color-brand-primary,#1e1e24)14]",
        "min-h-[640px] flex flex-col lg:flex-row items-stretch",
        className
      )}
    >
      {/* ── Visual Panel (trái khi login, lướt sang phải khi register trên desktop) ── */}
      <div
        className={cn(
          "relative hidden lg:flex lg:w-1/2 flex-col justify-between",
          "bg-brand text-ink-inverse p-8 overflow-hidden z-20 shrink-0",
          isMounted && "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
          mode === "register"
            ? "lg:translate-x-full shadow-[-12px_0_30px_rgba(0,0,0,0.25)]"
            : "lg:translate-x-0 shadow-[12px_0_30px_rgba(0,0,0,0.25)]"
        )}
        style={{ willChange: "transform" }}
        aria-hidden="true"
      >
        {/* Background decorative ambient glow */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-bold text-lg text-ink-inverse focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
            style={{ outline: "none" }}
            tabIndex={-1}
          >
            <div className="w-8 h-8 rounded-lg bg-ink-inverse flex items-center justify-center shadow-md">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand"
                aria-hidden="true"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
              </svg>
            </div>
            <span>Phone Store</span>
          </Link>
        </div>

        {/* Central content with E-commerce visual showcase */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-6">
          {/* E-commerce 3D Phone Shopping Image showcase */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] mx-auto aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group bg-black/20 my-auto">
            <Image
              src={visual.image}
              alt={visual.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            {/* Ambient gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Floating Tag Top */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{visual.tagTop}</span>
            </div>

            {/* Floating Tag Bottom */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 backdrop-blur-md text-brand border border-white/20 shadow-lg">
              <span>{visual.tagBottom}</span>
            </div>
          </div>

          {/* Text Info */}
          <div className="mt-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3 bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm">
              {visual.badge}
            </div>

            <h2 className="text-2xl font-bold leading-tight mb-2 text-white">
              {visual.heading}
            </h2>
            <p className="text-sm leading-relaxed text-white/75">
              {visual.tagline}
            </p>
          </div>
        </div>

        {/* Bottom switch CTA */}
        <div className="relative z-10 pt-2">
          {mode === "login" ? (
            <p className="text-sm text-white/70">
              Chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => onModeChange?.("register")}
                className="font-semibold text-white underline underline-offset-4 hover:text-white/90 transition-colors cursor-pointer"
              >
                Đăng ký miễn phí →
              </button>
            </p>
          ) : (
            <p className="text-sm text-white/70">
              Đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => onModeChange?.("login")}
                className="font-semibold text-white underline underline-offset-4 hover:text-white/90 transition-colors cursor-pointer"
              >
                Đăng nhập ngay →
              </button>
            </p>
          )}
        </div>
      </div>

      {/* ── Form Panel (phải khi login, lướt sang trái khi register trên desktop) ── */}
      <div
        className={cn(
          "w-full lg:w-1/2 flex flex-col justify-center",
          "overflow-y-auto max-h-[85vh] lg:max-h-[720px] z-10 shrink-0",
          isMounted && "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
          mode === "register" ? "lg:-translate-x-full" : "lg:translate-x-0"
        )}
        style={{ willChange: "transform" }}
      >
        {/* Mobile visual strip (ẩn trên lg) */}
        <div className="lg:hidden bg-brand text-ink-inverse px-5 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base"
          >
            <div className="w-7 h-7 rounded bg-ink-inverse flex items-center justify-center">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand"
                aria-hidden="true"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
              </svg>
            </div>
            Phone Store
          </Link>
          {mode === "login" ? (
            <button
              type="button"
              onClick={() => onModeChange?.("register")}
              className="text-sm font-medium text-ink-inverse underline"
            >
              Đăng ký
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onModeChange?.("login")}
              className="text-sm font-medium text-ink-inverse underline"
            >
              Đăng nhập
            </button>
          )}
        </div>

        {/* Form content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
          {loginForm || registerForm ? (
            <div className="relative w-full">
              {/* Login form wrapper */}
              <div
                className={cn(
                  "w-full transition-all duration-500 ease-in-out",
                  mode === "login"
                    ? "opacity-100 translate-x-0 relative z-10"
                    : "opacity-0 -translate-x-6 pointer-events-none absolute inset-0 invisible"
                )}
              >
                {loginForm}
              </div>

              {/* Register form wrapper */}
              <div
                className={cn(
                  "w-full transition-all duration-500 ease-in-out",
                  mode === "register"
                    ? "opacity-100 translate-x-0 relative z-10"
                    : "opacity-0 translate-x-6 pointer-events-none absolute inset-0 invisible"
                )}
              >
                {registerForm}
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
