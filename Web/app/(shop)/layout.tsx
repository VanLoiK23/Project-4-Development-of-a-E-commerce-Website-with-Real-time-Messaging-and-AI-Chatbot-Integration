import React, { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <Suspense
        fallback={
          <div
            className="h-14 lg:h-16 bg-[var(--color-brand-primary)]"
            aria-hidden="true"
          />
        }
      >
        <Header />
      </Suspense>
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
