import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Bg from "@/assets/imgs/background-img.jpg";
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
      <body className={`${FontJalnan.className} h-full`}>
        {children}
        <div className="fixed inset-0 -z-40">
          <Image
            alt="사우나 배경"
            src={Bg}
            fill
            loading="lazy"
            className="object-cover brightness-75"
          />
        </div>
      </body>
    </html>
  );
}
