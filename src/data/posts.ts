import type { DBPost } from "@/lib/types"

export const staticPosts: DBPost[] = [
  {
    id: "static-post-1",
    slug: "how-i-started-on-roblox",
    title: "How I started building games on Roblox",
    excerpt:
      "From playing random games to scripting my own worlds — this is the story of how a hobby became a skill set that changed everything.",
    image: "https://placehold.co/1200x630/1a1a1a/353535/png?text=Roblox+Origins",
    is_featured: true,
    view_count: 0,
    tags: ["roblox", "gamedev", "lua", "story"],
    published_at: "2025-06-10T00:00:00Z",
    created_at: "2025-06-10T00:00:00Z",
    content: [
      {
        id: "the-beginning",
        heading: "The beginning",
        body: "I was 12 when I first opened Roblox Studio. I didn't know what scripting was, or that I'd spend the next few years obsessed with it. I just wanted to make a game that my friends would actually want to play. That one afternoon turned into late nights, weekends, and an entire learning journey I didn't expect.",
      },
      {
        id: "learning-lua",
        heading: "Learning Lua",
        body: "Lua was my first programming language. I didn't read a book or take a course — I copied scripts, broke them, fixed them, and slowly understood what each line did. The Roblox Developer Hub was my bible. Every error message taught me something new.",
        items: [
          "LocalScript vs. Script — understanding client vs. server early",
          "RemoteEvents and RemoteFunctions for client-server communication",
          "DataStore for persistent player data",
          "Tweening for smooth animations in the game world",
        ],
      },
      {
        id: "first-real-game",
        heading: "My first real game",
        body: "After months of small experiments, I built something I was actually proud of. A simple obby with custom checkpoints, a leaderboard, and music that changed between zones. It wasn't viral — but it had players. Real people I didn't know were spending time inside something I made. That feeling is hard to explain.",
      },
      {
        id: "what-i-learned",
        heading: "What I learned from it all",
        body: "Roblox taught me to think in systems. Every game mechanic is a loop: input → logic → feedback. That mental model transfers to everything else — web apps, automation scripts, UI design. Starting in game development gave me a foundation I still use every day.",
      },
    ],
  },
  {
    id: "static-post-2",
    slug: "roblox-to-web-development",
    title: "Transitioning from Roblox to web development",
    excerpt:
      "Games and websites have more in common than you'd think. Here's how I made the jump and what surprised me most along the way.",
    image: "https://placehold.co/1200x630/1a1a1a/353535/png?text=Roblox+to+Web",
    is_featured: true,
    view_count: 0,
    tags: ["webdev", "nextjs", "transition", "roblox"],
    published_at: "2025-06-14T00:00:00Z",
    created_at: "2025-06-14T00:00:00Z",
    content: [
      {
        id: "why-the-web",
        heading: "Why the web?",
        body: "After a few years in Roblox development, I wanted to build things that didn't live inside a game engine. I wanted a website, a tool, something accessible from a browser. The web felt like the natural next step — a platform with billions of users and almost no limits.",
      },
      {
        id: "first-steps",
        heading: "First steps: HTML and CSS",
        body: "I thought HTML would be easy because I already knew how to code. I was wrong. Not because it's hard — it's not — but because designing for the web requires a completely different kind of thinking. Layouts, responsiveness, accessibility. Things that Roblox Studio just handled for you.",
        items: [
          "Box model — everything is a rectangle until it isn't",
          "Flexbox and Grid changed how I think about layout",
          "CSS variables for theming (similar to Roblox's Color3 values)",
          "Mobile-first design — something games rarely need to think about",
        ],
      },
      {
        id: "discovering-nextjs",
        heading: "Discovering Next.js",
        body: "JavaScript alone felt messy. I tried React, loved the component model (it reminded me of Roblox's modular scripting), and then found Next.js. The App Router, server components, and the way it handles routing felt intuitive. I built a small project in a weekend and was hooked.",
      },
      {
        id: "skills-that-transferred",
        heading: "Skills that transferred directly",
        body: "The transition wasn't as hard as I feared, because game development had already taught me the fundamentals: state management, event systems, separation of concerns, optimizing for performance. The language changed. The thinking didn't.",
        items: [
          "Component-based architecture (Roblox modules → React components)",
          "Async patterns (Promises mirror coroutines in Lua)",
          "Performance awareness — every frame matters in games AND on the web",
          "User feedback loops — if something feels slow, it's too slow",
        ],
      },
    ],
  },
  {
    id: "static-post-3",
    slug: "building-this-website",
    title: "Building krixishere.org — decisions and trade-offs",
    excerpt:
      "Every element on this site was a deliberate choice. Here's the tech stack, the design philosophy, and what I'd do differently.",
    image: "https://placehold.co/1200x630/1a1a1a/353535/png?text=Building+the+Site",
    is_featured: false,
    view_count: 0,
    tags: ["nextjs", "tailwind", "portfolio", "design"],
    published_at: "2025-06-18T00:00:00Z",
    created_at: "2025-06-18T00:00:00Z",
    content: [
      {
        id: "the-goal",
        heading: "The goal",
        body: "I didn't want a template. I wanted something that felt like me — minimal, fast, and a bit unusual. Most portfolios look the same: hero image, about section, projects, contact. I kept that structure but tried to make every piece of it feel intentional.",
      },
      {
        id: "tech-stack",
        heading: "Tech stack choices",
        body: "Next.js 16 with the App Router for the framework. Tailwind CSS v4 for styling — the new version with CSS variables is significantly better for theming. Framer Motion for animations because it makes complex transitions feel effortless. Supabase for the database because it's serverless and has a generous free tier.",
        items: [
          "Next.js 16 App Router — server components reduce client bundle size",
          "Tailwind CSS v4 — CSS-first config, no tailwind.config.js needed",
          "Framer Motion — layout animations with zero jank",
          "Supabase — Postgres with a REST API, instant setup",
          "Vercel — deployment in under a minute, preview branches",
        ],
      },
      {
        id: "design-philosophy",
        heading: "Design philosophy",
        body: "Monochromatic. Dark. Dense information without feeling cluttered. I took inspiration from tools I actually use every day — Linear, Vercel's dashboard, Raycast. They all share a quality: nothing is decorative unless it's also functional. Every color, every border, every shadow serves a purpose.",
      },
      {
        id: "what-id-do-differently",
        heading: "What I'd do differently",
        body: "Start with mobile. I designed desktop-first and retrofitted mobile, which is always more work than the other way around. Also: write the content before building the UI. I spent too long on animations for sections whose copy wasn't finished yet.",
      },
    ],
  },
]
