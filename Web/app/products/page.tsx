import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Container } from "@/components/layout/Container";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductsCatalog } from "@/components/product/ProductsCatalog";
import { getProductsData } from "@/api/products";

export const metadata: Metadata = {
  title: "Danh sách điện thoại – Phân tích ABSA & So sánh giá",
  description:
    "Khám phá danh sách điện thoại thông minh chính hãng với bộ lọc thông số chuyên sâu, lọc theo bộ sưu tập và đánh giá cảm xúc ABSA thực tế.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    collection?: string;
    category?: string;
    state?: string;
    [key: string]: string | undefined;
  }>;
}

function ProductsLoadingFallback() {
  return (
    <Container size="xl" className="py-6 sm:py-8 space-y-6">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 items-center">
        <Skeleton className="h-4 w-16 rounded-xs" />
        <span className="text-ink-3">/</span>
        <Skeleton className="h-4 w-20 rounded-xs" />
      </div>

      {/* Header Skeleton Card */}
      <div className="bg-surface border border-line rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-md" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>

        {/* Quick Filters Skeleton */}
        <div className="flex gap-2 overflow-hidden pt-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>

        {/* Sort Skeleton */}
        <div className="flex gap-2 pt-2 border-t border-line/60">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>

      {/* Grid Skeleton (8 product cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface p-4 rounded-xl border border-line space-y-3"
          >
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-md" />
            </div>
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <div className="pt-2 flex justify-between items-center">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

async function ProductsDynamicContent({
  searchParams,
}: {
  searchParams: Promise<{
    collection?: string;
    category?: string;
    brand?: string;
    brands?: string;
    pricePreset?: string;
    minPrice?: string;
    maxPrice?: string;
    os?: string;
    ramGb?: string;
    storageGb?: string;
    resolutions?: string;
    refreshRates?: string;
    charging?: string;
    quickTags?: string;
    sort?: string;
    page?: string;
    state?: string;
    [key: string]: string | undefined;
  }>;
}) {
  const params = await searchParams;
  const state = (params?.state === "loading" || params?.state === "error"
    ? params.state
    : "default") as "loading" | "error" | "default";

  const collection = params?.collection || params?.category;
  const filterState = {
    collection: collection || undefined,
    brands: params?.brand || params?.brands ? (params.brand || params.brands)!.split(",") : undefined,
    pricePresetId: params?.pricePreset,
    minPrice: params?.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params?.maxPrice ? Number(params.maxPrice) : undefined,
    os: params?.os ? params.os.split(",") : undefined,
    ramGb: params?.ramGb ? params.ramGb.split(",").map(Number) : undefined,
    storageGb: params?.storageGb ? params.storageGb.split(",").map(Number) : undefined,
    resolutions: params?.resolutions ? params.resolutions.split(",") : undefined,
    refreshRates: params?.refreshRates ? params.refreshRates.split(",").map(Number) : undefined,
    charging: params?.charging ? params.charging.split(",") : undefined,
    quickTags: params?.quickTags ? params.quickTags.split(",") : undefined,
    sort: (params?.sort as any) || "popular",
    page: params?.page ? Math.max(0, Number(params.page) - 1) : 0,
  };

  const productsRes = await getProductsData({ state }, filterState);

  // Handle preview loading state (?state=loading)
  if (state === "loading") {
    return <ProductsLoadingFallback />;
  }

  // Handle preview error state (?state=error)
  if (!productsRes.ok) {
    return (
      <Container size="xl" className="py-16 sm:py-24">
        <ErrorState
          title="Không thể tải danh sách sản phẩm"
          message={productsRes.error}
          onRetry={() => {
            if (typeof window !== "undefined") {
              window.location.reload();
            }
          }}
        />
      </Container>
    );
  }

  const { products, filterOptions, page = 0, totalPages = 1, totalElements = products.length } = productsRes.data;

  return (
    <ProductsCatalog
      initialProducts={products}
      filterOptions={filterOptions}
      initialCollection={collection}
      initialPage={page + 1}
      totalPages={totalPages}
      totalElements={totalElements}
    />
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <AppShell cartItemCount={2}>
      {/* Streamable dynamic product catalog wrapped in Suspense for prerender safety */}
      <Suspense fallback={<ProductsLoadingFallback />}>
        <ProductsDynamicContent searchParams={searchParams} />
      </Suspense>
    </AppShell>
  );
}
