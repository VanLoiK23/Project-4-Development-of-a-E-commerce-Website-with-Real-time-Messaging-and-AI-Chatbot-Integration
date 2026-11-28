"use client";

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "phonestore_tracking_consent_v1";

export type ConsentStatus = "accepted" | "rejected" | null;

let cachedConsentRaw: string | null = null;
let cachedConsent: ConsentStatus = null;

function subscribeConsent(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("phonestore-consent-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("phonestore-consent-change", handler);
  };
}

function getConsentSnapshot(): ConsentStatus {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedConsentRaw) {
      cachedConsentRaw = raw;
      if (raw === "accepted" || raw === "rejected") {
        cachedConsent = raw;
      } else {
        cachedConsent = null;
      }
    }
  } catch {}
  return cachedConsent;
}

function getServerSnapshot(): ConsentStatus {
  return "accepted"; // avoid banner flash during SSR
}

export function useConsent() {
  const status = useSyncExternalStore(
    subscribeConsent,
    getConsentSnapshot,
    getServerSnapshot
  );

  const notifyChange = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("phonestore-consent-change"));
    }
  };

  const acceptConsent = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {}
    notifyChange();
  }, []);

  const declineConsent = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "rejected");
    } catch {}
    notifyChange();
  }, []);

  return {
    status,
    hasAnswered: status !== null,
    isAccepted: status === "accepted",
    acceptConsent,
    declineConsent,
  };
}
