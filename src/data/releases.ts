import type { DBRelease } from "@/lib/types"

export const staticReleases: DBRelease[] = [
  {
    id: "static-v1.1.0",
    version: "v1.1.0",
    title: "v1.1.0: Tubelight Nav, Shader Background & Changelog",
    date: "June 13, 2025",
    image: "https://placehold.co/1200x700/0a0a0a/7c3aed/png?text=v1.1.0",
    excerpt:
      "Floating tubelight pill navbar, GradFlow animated WebGL shader replacing the static background, 403 error page, and this very changelog.",
    contributors: ["https://github.com/isnotkrix.png"],
    tags: ["ui", "navigation", "background"],
    author_note: null,
    created_at: "2025-06-13T00:00:00Z",
    content: [
      {
        heading: "Navigation",
        items: [
          "Added tubelight floating pill navbar with spring animation",
          "Simplified top header to logo + Hire me CTA",
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
          "403 Forbidden page with portal-back links",
          "This changelog at /changelog",
        ],
      },
    ],
  },
  {
    id: "static-v1.0.0",
    version: "v1.0.0",
    title: "v1.0.0: Portfolio Launch",
    date: "June 13, 2025",
    image: "https://placehold.co/1200x700/0a0a0a/ffffff/png?text=v1.0.0+Launch",
    excerpt:
      "Initial launch of krixishere.org — dark minimalist portfolio with hero, about, projects, skills, and contact sections.",
    contributors: ["https://github.com/isnotkrix.png"],
    tags: ["launch", "portfolio"],
    author_note: null,
    created_at: "2025-06-13T00:00:00Z",
    content: [
      {
        heading: "Sections",
        items: [
          "Hero with animated headline and social links",
          "About with stats grid",
          "Projects card grid with GitHub / live links",
          "Skills grouped by category",
          "Contact with social link cards",
        ],
      },
      {
        heading: "Tech stack",
        items: [
          "Next.js 16, Tailwind CSS v4, TypeScript",
          "Framer Motion animations",
          "Generated favicon (K + orange dot)",
        ],
      },
    ],
  },
]
