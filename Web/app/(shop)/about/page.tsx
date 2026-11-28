import React from "react";
import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutPartners } from "@/components/about/AboutPartners";
import { AboutTechnology } from "@/components/about/AboutTechnology";
import { AboutStoreInfo } from "@/components/about/AboutStoreInfo";

export const metadata: Metadata = {
  title: "Giới thiệu & Công nghệ ABSA | Phone Store",
  description:
    "Tìm hiểu về sứ mệnh mang lại thông tin trung thực cho người mua smartphone tại Việt Nam thông qua công nghệ phân tích cảm xúc đa khía cạnh (ABSA) và gợi ý cá nhân hóa.",
};

export default function AboutPage() {
  return (
    <div className="space-y-4">
      {/* 1. Hero Section */}
      <AboutHero />

      {/* 2. Story & Core Commitments */}
      <AboutStory />

      {/* 3. Official Brand Partners Ribbon */}
      <AboutPartners />

      {/* 4. Deep-Dive ABSA & Recommendation Technology */}
      <AboutTechnology />

      {/* 5. Store Details & Contact CTA */}
      <AboutStoreInfo />
    </div>
  );
}
