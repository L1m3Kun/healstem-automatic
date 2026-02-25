import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "힐스템 입장",
  description: "힐스템 입장 인원 체크 및 결제권 차감 자동화",
};

const FontJalnan = localFont({
  src: "../assets/fonts/jalnan/Jalnan2TTF.ttf",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={FontJalnan.className}>{children}</body>
    </html>
  );
}
