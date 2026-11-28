"use client";

import { useSyncExternalStore, useCallback, useState } from "react";
import { Product } from "@/types/product";

export interface CompareItem {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  storageLabel: string;
  colorName: string;
  absaOverall: {
    score: number;
    sentiment: string;
  };
}

const STORAGE_KEY = "phonestore_compare_items_v1";
const COLLAPSE_KEY = "phonestore_compare_collapsed_v1";
const MAX_COMPARE = 3;

let cachedItemsRaw: string | null = null;
let cachedItems: CompareItem[] = [];

let cachedCollapseRaw: string | null = null;
let cachedCollapse = false;

function subscribeCompare(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("phonestore-compare-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("phonestore-compare-change", handler);
  };
}

function getCompareSnapshot(): CompareItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedItemsRaw) {
      cachedItemsRaw = raw;
      if (raw) {
        const parsed = JSON.parse(raw);
        cachedItems = Array.isArray(parsed) ? parsed.slice(0, MAX_COMPARE) : [];
      } else {
        cachedItems = [];
      }
    }
  } catch {
    // LocalStorage blocked
  }
  return cachedItems;
}

function getCollapseSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(COLLAPSE_KEY);
    if (raw !== cachedCollapseRaw) {
      cachedCollapseRaw = raw;
      cachedCollapse = raw === "true";
    }
  } catch {}
  return cachedCollapse;
}

const SERVER_ITEMS: CompareItem[] = [];
function getServerSnapshot(): CompareItem[] {
  return SERVER_ITEMS;
}
function getServerCollapseSnapshot(): boolean {
  return false;
}

export function useCompare() {
  const items = useSyncExternalStore(
    subscribeCompare,
    getCompareSnapshot,
    getServerSnapshot
  );

  const isCollapsed = useSyncExternalStore(
    subscribeCompare,
    getCollapseSnapshot,
    getServerCollapseSnapshot
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const notifyChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("phonestore-compare-change"));
    }
  };

  const addToCompare = useCallback(
    (product: Product, storageLabel?: string, colorName?: string): boolean => {
      setErrorMessage(null);

      // Check if already in list
      const exists = items.some((item) => item.productId === product.id);
      if (exists) {
        // Toggle off if already exists
        const updated = items.filter((item) => item.productId !== product.id);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        notifyChange();
        return false;
      }

      // Check max limit 3
      if (items.length >= MAX_COMPARE) {
        const message = `Chỉ có thể so sánh tối đa ${MAX_COMPARE} sản phẩm. Hãy xóa bớt 1 máy trong thanh so sánh.`;
        setErrorMessage(message);
        if (typeof window !== "undefined") {
          alert(message);
        }
        return false;
      }

      const activeVariant =
        product.variants.find((v) => v.storageLabel === storageLabel) ||
        product.variants[0];
      const activeColor =
        activeVariant?.colors.find((c) => c.name === colorName) ||
        activeVariant?.colors[0];

      const newItem: CompareItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: activeVariant ? activeVariant.price : product.price,
        storageLabel: activeVariant ? activeVariant.storageLabel : "256 GB",
        colorName: activeColor ? activeColor.name : "Tiêu chuẩn",
        absaOverall: product.absaOverall,
      };

      const updated = [...items, newItem];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(COLLAPSE_KEY, "false");
      } catch {}
      notifyChange();
      return true;
    },
    [items]
  );

  const removeFromCompare = useCallback(
    (productId: string) => {
      setErrorMessage(null);
      const updated = items.filter((item) => item.productId !== productId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      notifyChange();
    },
    [items]
  );

  const clearCompare = useCallback(() => {
    setErrorMessage(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    notifyChange();
  }, []);

  const toggleCollapse = useCallback(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(!isCollapsed));
    } catch {}
    notifyChange();
  }, [isCollapsed]);

  const isInCompare = useCallback(
    (productId: string) => items.some((item) => item.productId === productId),
    [items]
  );

  return {
    items,
    isCollapsed,
    errorMessage,
    addToCompare,
    removeFromCompare,
    clearCompare,
    toggleCollapse,
    isInCompare,
    maxCompare: MAX_COMPARE,
  };
}
