import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GAS",
  description: "Generic Admin System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
