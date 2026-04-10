import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "AI Trends, Jobs, and Design Intelligence",
  description: "Live intelligence platform for AI updates, jobs, design signals, and upskilling priorities."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
