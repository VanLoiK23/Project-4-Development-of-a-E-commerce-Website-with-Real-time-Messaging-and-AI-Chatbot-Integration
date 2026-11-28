import { SentimentMeta } from "@/types/absa";

/**
 * Pure helper function returning sentiment level and styling metadata based on aggregated ABSA score.
 * Thresholds (design-decisions.md §1.3):
 * - Score >= 4.0: Positive ("Tích cực", pos)
 * - Score 3.0 - 3.9: Neutral ("Trung lập", neu)
 * - Score < 3.0: Negative ("Tiêu cực", neg)
 */
export function getSentimentLevel(score: number): SentimentMeta {
  if (score >= 4.0) {
    return {
      level: "pos",
      label: "Tích cực",
      textClass: "text-pos",
      bgSoftClass: "bg-pos-soft",
    };
  }
  if (score >= 3.0) {
    return {
      level: "neu",
      label: "Trung lập",
      textClass: "text-neu",
      bgSoftClass: "bg-neu-soft",
    };
  }
  return {
    level: "neg",
    label: "Tiêu cực",
    textClass: "text-neg",
    bgSoftClass: "bg-neg-soft",
  };
}
