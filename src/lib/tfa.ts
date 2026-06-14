import { createHmac } from "crypto"

export function tfaToken(discordId: string): string {
  const secret = process.env.AUTH_SECRET ?? ""
  return createHmac("sha256", secret).update(discordId).digest("hex")
}
