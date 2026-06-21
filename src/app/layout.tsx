import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RepoButton from "@/components/RepoButton";
import { PortfolioNav } from "@/components/PortfolioNav";
import { PageLoader } from "@/components/PageLoader";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/ui/footer";
import { Code2 } from "lucide-react";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { auth } from "@/auth";

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
          <Footer
            logo={<Code2 className="size-6 text-foreground/60" />}
            brandName="Krix"
            socialLinks={[
              { icon: <IconBrandGithub className="size-4" />, href: "https://github.com", label: "GitHub" },
              { icon: <IconBrandX className="size-4" />, href: "https://x.com", label: "X (Twitter)" },
            ]}
            mainLinks={[
              { href: "/", label: "Home" },
              { href: "/changelog", label: "Changelog" },
            ]}
            legalLinks={[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" },
            ]}
            copyright={{
              text: `© ${new Date().getFullYear()} Krix`,
              license: "All rights reserved",
            }}
          />
          {/* <PortfolioNav /> */}
        </Providers>
      </body>
    </html>
  );
}
