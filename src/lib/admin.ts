export function isAdmin(discordId?: string): boolean {
  if (!discordId) return false
  const raw = process.env.ADMIN_DISCORD_IDS ?? ""
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(discordId)
}
