import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RepoButton from "@/components/RepoButton";
import { PortfolioNav } from "@/components/PortfolioNav";
import { PageLoader } from "@/components/PageLoader";
import { Providers } from "@/components/Providers";
import { FlickeringFooter } from "@/components/ui/flickering-footer";
import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krix — Roblox Developer",
  description: "Roblox developer and web builder. Projects, experiments, and everything I'm working on.",
  keywords: ["roblox", "developer", "portfolio", "web development", "game dev"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers session={session}>
          <PageLoader />
          <RepoButton />
          {children}
          <FlickeringFooter />
          {/* <PortfolioNav /> */}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
