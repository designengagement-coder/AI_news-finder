import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Trends, Jobs, and Design Intelligence",
  description: "Live intelligence platform for AI updates, jobs, design signals, and upskilling priorities."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
