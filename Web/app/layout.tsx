import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthWrapper } from "@/context/AuthContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Phone Store",
    default: "Phone Store – Điện thoại thông minh & Gợi ý AI",
  },
  description:
    "Cửa hàng điện thoại thông minh tích hợp gợi ý theo nhu cầu và phân tích cảm xúc đánh giá đa khía cạnh (ABSA).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={`h-full antialiased ${jakarta.variable}`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans">
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
