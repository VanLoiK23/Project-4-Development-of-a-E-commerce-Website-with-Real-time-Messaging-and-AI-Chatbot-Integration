export type SentimentType = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export interface AspectScore {
  aspectKey: string;
  displayName: string;
  score: number; // 1.0 - 5.0
  sentiment: SentimentType;
  mentionCount: number;
  confidence: number; // 0.0 - 1.0
}

export interface AspectLeader {
  aspectKey: string;
  displayName: string;
  products: import("./product").Product[];
}

export type SentimentLevel = "pos" | "neu" | "neg";

export interface SentimentMeta {
  level: SentimentLevel;
  label: string;
  textClass: string;
  bgSoftClass: string;
  borderClass?: string;
}
