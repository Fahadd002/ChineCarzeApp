import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutWrapper from "@/components/RootLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cine Craze - Online Movie, Drama streaming platform",
  description: "A comprehensive movie and drama streaming platform built with Next.js, TypeScript, and Tailwind CSS. This application provides features for browsing content, watching movies and dramas, and managing your viewing experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const className = `${geistSans.variable} ${geistMono.variable} antialiased`;
  
  return (
    <RootLayoutWrapper className={className}>
      {children}
    </RootLayoutWrapper>
  );
}
