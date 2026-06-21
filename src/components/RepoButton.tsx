import { RepoButtonClient } from "@/components/RepoButtonClient"

async function getStars(): Promise<number | null> {
  try {
    const res = await fetch("https://api.github.com/repos/isnotkrix/krixishere.org", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.stargazers_count ?? null
  } catch {
    return null
  }
}

export default async function RepoButton() {
  const stars = await getStars()
  return <RepoButtonClient stars={stars} />
}
