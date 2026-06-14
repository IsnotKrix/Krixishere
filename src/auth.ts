import NextAuth, { type DefaultSession } from "next-auth"
import Discord from "next-auth/providers/discord"
import { isAdmin } from "@/lib/admin"
import { getSupabase } from "@/lib/supabase"

declare module "next-auth" {
  interface Session {
    user: {
      discordId?: string
      isAdmin?: boolean
      hasPasskey?: boolean
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
    }),
  ],
  events: {
    async signIn({ user, profile }) {
      if (!profile) return
      const discordProfile = profile as { id: string; global_name?: string; username?: string; avatar?: string }
      try {
        const supabase = getSupabase()
        await supabase.from("user_registry").upsert({
          discord_id: discordProfile.id,
          username: discordProfile.global_name ?? discordProfile.username ?? user.name ?? "Unknown",
          avatar_url: user.image ?? null,
          last_login: new Date().toISOString(),
        }, { onConflict: "discord_id", ignoreDuplicates: false })
      } catch { /* non-critical */ }
    },
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordId = (profile as { id: string }).id
        token.discordId = discordId
        token.isAdmin = isAdmin(discordId)

        try {
          const supabase = getSupabase()
          const { data } = await supabase
            .from("passkeys")
            .select("id")
            .eq("user_id", discordId)
            .limit(1)
          token.hasPasskey = (data?.length ?? 0) > 0
        } catch {
          token.hasPasskey = false
        }
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId as string | undefined
        session.user.isAdmin = token.isAdmin as boolean | undefined
        session.user.hasPasskey = token.hasPasskey as boolean | undefined
        session.user.email = undefined as never
      }
      return session
    },
  },
})
