"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SlideItem } from "@/types/home";

/* -------------------------------------------------------------------------
 * Dữ liệu mock – mô phỏng bảng `banners` / `slides` từ DB
 * Thả ảnh thật vào:  public/images/banners/banner-1.webp  ...  banner-6.webp
 * -------------------------------------------------------------------------*/
interface BannerSlide {
  id: string;
  sortOrder: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkHref: string;
  isActive: boolean;
}

const HERO_SLIDES: BannerSlide[] = [
  {
    id: "banner-1",
    sortOrder: 1,
    title: "iPhone 16 Pro – Chụp ảnh vô đối",
    subtitle: "Camera 48MP, chip A18 Pro siêu mạnh",
    imageUrl: "/images/banners/banner-1.webp",
    linkHref: "/products?brand=Apple",
    isActive: true,
  },
  {
    id: "banner-2",
    sortOrder: 2,
    title: "Samsung Galaxy S25 Ultra – Màn hình 2K siêu nét",
    subtitle: "S Pen thế hệ mới, pin 5000mAh suốt ngày",
    imageUrl: "/images/banners/banner-2.webp",
    linkHref: "/products?brand=Samsung",
    isActive: true,
  },
  {
    id: "banner-3",
    sortOrder: 3,
    title: "OPPO Find X8 Pro – Hasselblad Camera System",
    subtitle: "Zoom quang học 6x, chống rung OIS tiên tiến",
    imageUrl: "/images/banners/banner-3.webp",
    linkHref: "/products?brand=OPPO",
    isActive: true,
  },
  {
    id: "banner-4",
    sortOrder: 4,
    title: "Xiaomi 15 Ultra – Leica Summilux Lens",
    subtitle: "Chip Snapdragon 8 Elite, sạc 90W siêu tốc",
    imageUrl: "/images/banners/banner-4.webp",
    linkHref: "/products?brand=Xiaomi",
    isActive: true,
  },
  {
    id: "banner-5",
    sortOrder: 5,
    title: "ASUS ROG Phone 9 – Gaming đỉnh cao",
    subtitle: "165Hz AMOLED, hệ thống tản nhiệt buồng hơi",
    imageUrl: "/images/banners/banner-5.webp",
    linkHref: "/products?category=gaming",
    isActive: true,
  },
  {
    id: "banner-6",
    sortOrder: 6,
    title: "Google Pixel 9 Pro – AI Camera thần kỳ",
    subtitle: "Magic Eraser, Best Take, Gemini AI tích hợp",
    imageUrl: "/images/banners/banner-6.webp",
    linkHref: "/products?brand=Google",
    isActive: true,
  },
];

const ACTIVE_SLIDES = HERO_SLIDES.filter((s) => s.isActive).sort(
  (a, b) => a.sortOrder - b.sortOrder
);

const SLIDE_INTERVAL_MS = 4000;

/* ── SVG fallback banner đẹp – hiển thị khi chưa có ảnh thật ─────────── */
function BannerFallback({ slide }: { slide: BannerSlide }) {
  /* Màu gradient theo sortOrder để từng slide khác nhau */
  const PALETTES = [
    ["#1e3a5f", "#2563eb"],
    ["#1a3344", "#0ea5e9"],
    ["#2d1b4e", "#7c3aed"],
    ["#1f3328", "#16a34a"],
    ["#3b1a1a", "#dc2626"],
    ["#1a1a3b", "#4f46e5"],
  ];
  const [from, to] = PALETTES[(slide.sortOrder - 1) % PALETTES.length];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 840 315"
      className="w-full h-full"
      aria-label={slide.title}
      role="img"
    >
      <defs>
        <linearGradient id={`grad-${slide.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        {/* subtle grid pattern */}
        <pattern id={`grid-${slide.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </pattern>
        {/* glowing circle */}
        <radialGradient id={`glow-${slide.id}`} cx="75%" cy="40%" r="45%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="840" height="315" fill={`url(#grad-${slide.id})`} />
      <rect width="840" height="315" fill={`url(#grid-${slide.id})`} />
      <ellipse cx="630" cy="130" rx="260" ry="180" fill={`url(#glow-${slide.id})`} />

      {/* Decorative circles */}
      <circle cx="700" cy="260" r="80" fill="rgba(255,255,255,0.04)" />
      <circle cx="760" cy="80" r="50" fill="rgba(255,255,255,0.06)" />
      <circle cx="80" cy="280" r="60" fill="rgba(255,255,255,0.03)" />

      {/* Badge pill */}
      <rect x="40" y="48" width="140" height="24" rx="12" fill="rgba(255,255,255,0.15)" />
      <text x="110" y="64" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="11" fill="rgba(255,255,255,0.9)" fontWeight="600">
        KHUYẾN MÃI HOT
      </text>

      {/* Title */}
      <text
        x="40"
        y="118"
        fontFamily="system-ui,sans-serif"
        fontSize="26"
        fontWeight="800"
        fill="#ffffff"
        style={{ letterSpacing: "-0.5px" }}
      >
        {slide.title.length > 34 ? slide.title.slice(0, 34) + "…" : slide.title}
      </text>

      {/* Subtitle */}
      {slide.subtitle && (
        <text
          x="40"
          y="150"
          fontFamily="system-ui,sans-serif"
          fontSize="14"
          fill="rgba(255,255,255,0.75)"
        >
          {slide.subtitle.length > 52 ? slide.subtitle.slice(0, 52) + "…" : slide.subtitle}
        </text>
      )}

      {/* CTA button */}
      <rect x="40" y="180" width="140" height="38" rx="8" fill="rgba(255,255,255,0.22)" />
      <rect x="40" y="180" width="140" height="38" rx="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
      <text x="110" y="203" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="700" fill="#ffffff">
        Xem ngay →
      </text>

      {/* Decorative phone outline */}
      <rect x="640" y="55" width="140" height="210" rx="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <rect x="655" y="75" width="110" height="170" rx="8" fill="rgba(255,255,255,0.07)" />
      <circle cx="710" cy="68" r="4" fill="rgba(255,255,255,0.3)" />
    </svg>
  );
}

/* ── Banner Image card – single banner slot ───────────────────────────── */
function BannerCard({ slide }: { slide: BannerSlide }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={slide.linkHref}
      className="relative block w-full overflow-hidden rounded-xl border border-line/70 shadow-sm
                 aspect-[21/9] md:aspect-auto md:h-full
                 focus-visible:outline-2 focus-visible:outline-brand"
      tabIndex={0}
      aria-label={slide.title}
    >
      {!imgError ? (
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full h-full object-cover"
          draggable={false}
          onError={() => setImgError(true)}
        />
      ) : (
        <BannerFallback slide={slide} />
      )}

      {/* Gradient overlay + caption */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
        <p className="text-white font-semibold text-sm sm:text-base leading-tight drop-shadow line-clamp-1">
          {slide.title}
        </p>
        {slide.subtitle && (
          <p className="text-white/75 text-xs mt-0.5 drop-shadow line-clamp-1 hidden sm:block">
            {slide.subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

export interface HeroSectionProps {
  slides?: SlideItem[];
}

/* ── HeroSection – 2 banner ngang trượt cạnh nhau ─────────────────────── */
export function HeroSection({ slides: propSlides }: HeroSectionProps = {}) {
  const slides = useMemo(() => {
    if (propSlides && propSlides.length > 0) {
      const valid = propSlides.filter((s) => s.status !== 0 && s.trash !== "disable");
      if (valid.length > 0) {
        return valid.map((s, idx) => {
          let imageUrl = s.image;
          if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
            imageUrl = `/images/banners/${imageUrl}`;
          }
          return {
            id: String(s.id),
            sortOrder: idx + 1,
            title: s.title || `Khuyến mãi đặc biệt #${s.id}`,
            subtitle: s.subtitle || "Khám phá ngay ưu đãi công nghệ tốt nhất",
            imageUrl,
            linkHref: s.linkHref || "/products",
            isActive: true,
          };
        });
      }
    }
    return ACTIVE_SLIDES;
  }, [propSlides]);

  const [index, setIndex] = useState(0); // index của banner BÊN TRÁI
  const [paused, setPaused] = useState(false);

  /* Chỉ tiến index 1 bước → bên phải = (index + 1) */
  const goTo = useCallback(
    (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length),
    [slides.length]
  );
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);
  const next = useCallback(() => goTo(index + 1), [index, goTo]);

  /* Auto-slide 4s, dừng khi hover/focus hoặc prefers-reduced-motion */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || mq.matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  const left = slides[index];
  const right = slides[(index + 1) % slides.length];

  return (
    <section
      className="py-3 sm:py-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Banner sản phẩm nổi bật"
    >
      {/* SEO h1 ẩn – đảm bảo trang có đúng 1 thẻ h1 */}
      <h1 className="sr-only">
        Cửa hàng điện thoại – Chọn smartphone chuẩn xác từ hàng nghìn đánh giá thực tế
      </h1>

      <Container size="xl">
        {/* Wrapper tổng – relative để đặt mũi tên đè lên */}
        <div className="relative group/hero">

          {/* ── Grid 2 banner ngang ─────────────────────────── */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-3 md:h-[300px] lg:h-[340px]"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Banner trái */}
            <BannerCard slide={left} />

            {/* Banner phải – ẩn ở mobile, hiện từ md */}
            <div className="hidden md:block h-full">
              <BannerCard slide={right} />
            </div>
          </div>

          {/* ── Nút mũi tên ◀ / ▶ ──────────────────────────── */}
          <button
            onClick={prev}
            aria-label="Banner trước"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm border border-line shadow-md
                       flex items-center justify-center
                       opacity-0 group-hover/hero:opacity-100 transition-opacity duration-200
                       hover:bg-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <ChevronLeft className="w-4 h-4 text-ink" />
          </button>
          <button
            onClick={next}
            aria-label="Banner tiếp theo"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20
                       w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm border border-line shadow-md
                       flex items-center justify-center
                       opacity-0 group-hover/hero:opacity-100 transition-opacity duration-200
                       hover:bg-white focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-brand"
          >
            <ChevronRight className="w-4 h-4 text-ink" />
          </button>
        </div>

        {/* ── Dots chỉ báo ──────────────────────────────────── */}
        <div
          className="flex items-center justify-center gap-1.5 mt-2.5"
          role="tablist"
          aria-label="Chọn banner"
        >
          {slides.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Banner ${i + 1}: ${s.title}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand ${
                i === index
                  ? "w-5 bg-brand"
                  : "w-1.5 bg-line hover:bg-ink-3"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
