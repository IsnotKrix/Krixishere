import NextAuth, { type DefaultSession } from "next-auth"
import Discord from "next-auth/providers/discord"
import { isAdmin } from "@/lib/admin"

declare module "next-auth" {
  interface Session {
    user: {
      discordId?: string
      isAdmin?: boolean
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
    jwt({ token, account, profile }) {
      if (account?.provider === "discord" && profile) {
        const discordId = (profile as { id: string }).id
        token.discordId = discordId
        token.isAdmin = isAdmin(discordId)
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.discordId = token.discordId as string | undefined
        session.user.isAdmin = token.isAdmin as boolean | undefined
      }
      return session
    },
  },
})
