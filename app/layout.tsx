import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "힐스템 입장",
  description: "힐스템 입장 인원 체크 및 결제권 차감 자동화",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
