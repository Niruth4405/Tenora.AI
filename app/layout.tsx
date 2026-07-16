import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ToasterProvider from "./components/providers/toaster-provider";
// import SiteNavbar from "./components/marketing/site-navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tenora AI",
  description: "tenora ai is an ai-powered content writing assistant for startups, creators, and lean teams. Transform rough company updates into polished platform-specific drafts that capture your brand voice and resonate with your audience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* <SiteNavbar /> */}
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
