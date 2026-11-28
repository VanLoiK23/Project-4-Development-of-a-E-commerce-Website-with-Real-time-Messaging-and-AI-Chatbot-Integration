"use client";

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "phonestore_favorites_v1";

let cachedFavsRaw: string | null = null;
let cachedFavs: string[] = [];

function subscribeFavorites(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("phonestore-favorites-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("phonestore-favorites-change", handler);
  };
}

function getFavoritesSnapshot(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedFavsRaw) {
      cachedFavsRaw = raw;
      if (raw) {
        const parsed = JSON.parse(raw);
        cachedFavs = Array.isArray(parsed) ? parsed : [];
      } else {
        cachedFavs = [];
      }
    }
  } catch {}
  return cachedFavs;
}

const SERVER_FAVS: string[] = [];
function getServerSnapshot(): string[] {
  return SERVER_FAVS;
}

export function useFavorites() {
  const favorites = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getServerSnapshot
  );

  const notifyChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("phonestore-favorites-change"));
    }
  };

  const toggleFavorite = useCallback(
    (productId: string) => {
      const exists = favorites.includes(productId);
      const updated = exists
        ? favorites.filter((id) => id !== productId)
        : [...favorites, productId];

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}

      notifyChange();
    },
    [favorites]
  );

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  return {
    favorites,
    isFavorite,
    toggleFavorite,
  };
}
