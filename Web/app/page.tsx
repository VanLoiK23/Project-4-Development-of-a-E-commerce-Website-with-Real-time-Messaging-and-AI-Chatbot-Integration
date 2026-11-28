import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { HeroSection } from "@/components/home/HeroSection";
import { CatalogFilterSection } from "@/components/home/CatalogFilterSection";
import { ForYouSection } from "@/components/home/ForYouSection";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { AbsaHighlightsSection } from "@/components/home/AbsaHighlightsSection";
import { AbsaExplainerSection } from "@/components/home/AbsaExplainerSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { GuaranteeStrip } from "@/components/home/GuaranteeStrip";
import { getHomeData, getRecommendations } from "@/api/home";

export const metadata: Metadata = {
  title: "Phone Store – Chọn smartphone chuẩn xác từ đánh giá thực tế",
  description:
    "Cửa hàng điện thoại thông minh tích hợp gợi ý AI theo nhu cầu và phân tích cảm xúc đánh giá đa khía cạnh (ABSA).",
};

interface HomePageProps {
  searchParams: Promise<{
    profile?: string;
    state?: string;
  }>;
}

function HomeLoadingFallback() {
  return (
    <Container size="xl" className="py-8 space-y-12">
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/4 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-surface p-4 rounded-xl border border-line space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

async function HomeDynamicContent({
  searchParams,
}: {
  searchParams: Promise<{ profile?: string; state?: string }>;
}) {
  const params = await searchParams;
  const profile = (params?.profile === "cold" ? "cold" : "ready") as "ready" | "cold";
  const state = (params?.state === "loading" || params?.state === "error"
    ? params.state
    : "default") as "loading" | "error" | "default";

  const [homeRes, recRes] = await Promise.all([
    getHomeData({ state, profile }),
    getRecommendations({ state, profile }),
  ]);

  if (!homeRes.ok) {
    return (
      <Container size="xl" className="py-16 sm:py-24">
        <ErrorState
          title="Không thể tải dữ liệu trang chủ"
          message={homeRes.error}
        />
      </Container>
    );
  }

  // Handle Loading preview state (?state=loading)
  if (state === "loading") {
    return <HomeLoadingFallback />;
  }

  const homeData = homeRes.data;
  const recommendations = recRes.ok ? recRes.data : [];

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection slides={homeData.slides} />

      {/* 2. Catalog Filtering Section */}
      <CatalogFilterSection
        products={homeData.allProducts}
        filterOptions={homeData.filterOptions}
      />

      {/* 3. For You Section (Recommendation Rail) */}
      <ForYouSection
        recommendations={recommendations}
        profile={profile}
      />

      {/* 4. Curated Collections Section */}
      <CollectionsSection
        collections={homeData.collections}
      />

      {/* 5. ABSA Community Highlights Section */}
      <AbsaHighlightsSection
        aspectLeaders={homeData.aspectLeaders}
      />

      {/* 7. Latest Posts Section */}
      <LatestPostsSection
        posts={homeData.posts}
      />
    </>
  );
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <AppShell cartItemCount={2}>
      {/* Dynamic catalog & recommendation stream wrapped in Suspense for prerender safety */}
      <Suspense fallback={<HomeLoadingFallback />}>
        <HomeDynamicContent searchParams={searchParams} />
      </Suspense>

      {/* 6. ABSA Explainer Section (3 steps) */}
      <AbsaExplainerSection />

      {/* 8. Service Guarantees Footer Strip */}
      <GuaranteeStrip />
    </AppShell>
  );
}
