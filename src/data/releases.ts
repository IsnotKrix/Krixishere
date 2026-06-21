import type { DBRelease } from "@/lib/types"

export const staticReleases: DBRelease[] = [
  {
    id: "static-v1.3.0",
    version: "v1.3.0",
    title: "Navigation overhaul, analytics & pixel trail",
    date: "June 21, 2025",
    image: "https://placehold.co/1200x600/1a1a1a/353535/png?text=v1.3.0",
    excerpt:
      "The nav is now a compact floating pill centered at the top. RepoButton is gone. Vercel Analytics wired up. Pixel trail added to footer.",
    contributors: ["https://github.com/isnotkrix.png"],
    tags: ["navigation", "analytics", "footer", "ux"],
    author_note: null,
    created_at: "2025-06-21T00:00:00Z",
    content: [
      {
        heading: "Navigation",
        items: [
          "Replaced full-width bar with a centered compact pill",
          "Pill floats with glass background when scrolling past 50px",
          "Removed RepoButton (star count widget) from the corner",
          "Smoother spring animation on page load",
        ],
      },
      {
        heading: "Analytics & performance",
        items: [
          "Added Vercel Analytics to all pages",
          "Hero background switched to next/image with fill + priority for LCP",
          "OpenGraph and Twitter card metadata added",
        ],
      },
      {
        heading: "Footer",
        items: [
          "Pixel trail effect layered over the flickering grid at the bottom",
          "GooeyFilter applied to pixel particles for organic feel",
        ],
      },
    ],
  },
  {
    id: "static-v1.2.0",
    version: "v1.2.0",
    title: "Design system unification",
    date: "June 20, 2025",
    image: "https://placehold.co/1200x600/1a1a1a/353535/png?text=v1.2.0",
    excerpt:
      "Monochromatic palette rolled out across every page. Removed all violet and orange accents. Fixed GitHub star count. Cleaned up the 403 page.",
    contributors: ["https://github.com/isnotkrix.png"],
    tags: ["design", "ui", "consistency"],
    author_note: null,
    created_at: "2025-06-20T00:00:00Z",
    content: [
      {
        heading: "Color palette",
        items: [
          "Unified CSS variables: --background #1a1a1a, --foreground #d9d9d9, --muted-foreground #808080",
          "Removed all violet and emerald accent classes from Privacy and Terms pages",
          "403 Forbidden page redesigned from scratch — monochromatic, no red",
        ],
      },
      {
        heading: "Fixes",
        items: [
          "GitHub star count was fetching from wrong repo (isnotkrix/krixishere.org) — fixed to isnotkrix/krixishere",
          "next.config.ts: added iclarified.com and cdn.discordapp.com to image remote patterns",
        ],
      },
    ],
  },
  {
    id: "static-v1.1.0",
    version: "v1.1.0",
    title: "Navbar, shader background & changelog",
    date: "June 13, 2025",
    image: "https://placehold.co/1200x600/1a1a1a/353535/png?text=v1.1.0",
    excerpt:
      "Floating tubelight pill navbar, GradFlow animated WebGL shader replacing the static background, 403 error page, and this very changelog.",
    contributors: ["https://github.com/isnotkrix.png"],
    tags: ["navigation", "background", "pages"],
    author_note: null,
    created_at: "2025-06-13T00:00:00Z",
    content: [
      {
        heading: "Navigation",
        items: [
          "Added tubelight floating pill navbar with spring animation",
          "Simplified header to logo + nav links + GitHub icon",
        ],
      },
      {
        heading: "Background",
        items: [
          "Replaced CSS grid lines with dot pattern",
          "GradFlow WebGL silk shader on hero section",
        ],
      },
      {
        heading: "New pages",
        items: [
          "403 Forbidden page with link back to home",
          "Changelog at /changelog",
          "Privacy policy and Terms of service pages",
        ],
      },
    ],
  },
  {
    id: "static-v1.0.0",
    version: "v1.0.0",
    title: "Portfolio launch",
    date: "June 13, 2025",
    image: "https://placehold.co/1200x600/1a1a1a/353535/png?text=v1.0.0",
    excerpt:
      "Initial launch of krixishere.org — dark minimalist portfolio with hero, about, and projects sections.",
    contributors: ["https://github.com/isnotkrix.png"],
    tags: ["launch"],
    author_note: null,
    created_at: "2025-06-13T00:00:00Z",
    content: [
      {
        heading: "Sections",
        items: [
          "Hero with animated headline and pixel trail effect",
          "About with stats grid",
          "Projects card grid",
        ],
      },
      {
        heading: "Tech stack",
        items: [
          "Next.js 16, Tailwind CSS v4, TypeScript",
          "Framer Motion animations throughout",
          "next/og generated favicon",
        ],
      },
    ],
  },
]
