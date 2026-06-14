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
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordId = (profile as { id: string }).id
        token.discordId = discordId
        token.isAdmin = isAdmin(discordId)

        // Check if user has any passkeys registered (only on sign-in)
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
        // Strip email — we don't collect or expose personal info
        session.user.email = undefined as never
      }
      return session
    },
  },
})
