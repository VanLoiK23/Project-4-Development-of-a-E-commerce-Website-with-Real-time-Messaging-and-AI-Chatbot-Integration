import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CompareBar } from "@/components/product/CompareBar";
import { ConsentBanner } from "@/components/home/ConsentBanner";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  cartItemCount?: number;
  className?: string;
}

/**
 * Standard Layout Shell conforming to Prompt 02 Phase A & component-guidelines.md §2.
 * Directly mounts Header, Footer, BottomNav (<1024px), CompareBar, and ConsentBanner.
 * Includes skip navigation link and ensures <main id="main"> is not obscured.
 */
export function AppShell({
  children,
  cartItemCount = 0,
  className,
}: AppShellProps) {
  return (
    <div className={cn("min-h-screen flex flex-col bg-canvas text-ink", className)}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-brand focus:text-ink-inverse focus:rounded-md focus:shadow-md focus:outline-none"
      >
        Bỏ qua điều hướng
      </a>

      <Header cartItemCount={cartItemCount} />

      {/* Primary content landmark - bottom padding ensures bottom nav / compare bar does not obscure contents */}
      <main id="main" className="flex-1 pb-20 lg:pb-12">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Bottom Nav for mobile/tablet (<1024px) */}
      <BottomNav />

      {/* Persistent Compare Bar (Floating at bottom, max 3 items) */}
      <CompareBar />

      {/* Persistent Consent Notice (First visit) */}
      <ConsentBanner />
    </div>
  );
}
