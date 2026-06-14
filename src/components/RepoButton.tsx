import { GithubIcon } from "@/components/icons";

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch("https://api.github.com/repos/isnotkrix/krixishere.org", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.stargazers_count ?? null;
  } catch {
    return null;
  }
}

export default async function RepoButton() {
  const stars = await getStars();

  return (
    <a
      href="https://github.com/isnotkrix/krixishere.org"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-4 right-4 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md text-xs text-zinc-400 hover:text-white hover:border-violet-400/40 transition-all duration-200 group"
    >
      <GithubIcon size={13} />
      <span className="hidden sm:inline font-medium">isnotkrix/krixishere.org</span>
      {stars !== null && (
        <span className="flex items-center gap-1 pl-1.5 border-l border-white/10 text-zinc-500 group-hover:text-yellow-400 transition-colors">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {stars.toLocaleString()}
        </span>
      )}
    </a>
  );
}
