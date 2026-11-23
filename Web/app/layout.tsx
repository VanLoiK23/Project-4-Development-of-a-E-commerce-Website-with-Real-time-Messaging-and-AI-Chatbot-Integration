import type { Metadata } from "next";
import "./globals.css";

// TODO: Switch to next/font/local when custom font files (Plus Jakarta Sans) are added to app/fonts/

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
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
