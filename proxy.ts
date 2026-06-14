import { auth } from "@/auth"
import { tfaToken } from "@/lib/tfa"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Only skip paths strictly required to perform the 2FA flow itself
const SKIP_PATHS = [
  "/verify",
  "/api/auth/",               // NextAuth session/callback endpoints
  "/api/passkeys/auth-options", // needed to begin 2FA
  "/api/passkeys/auth-verify",  // needed to complete 2FA
  "/consent",
  "/privacy",
  "/terms",
  "/_next",
  "/favicon",
  "/icon",
]

export async function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url)

  if (SKIP_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const session = await auth()

  if (session?.user?.hasPasskey && session.user.discordId) {
    const tfaCookie = request.cookies.get("x-tfa")
    const expected = tfaToken(session.user.discordId)

    if (tfaCookie?.value !== expected) {
      const verifyUrl = new URL("/verify", request.url)
      verifyUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(verifyUrl)
    }
  }

  return NextResponse.next()
}
