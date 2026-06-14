import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Paths that never require 2FA
const SKIP_PATHS = [
  "/verify",
  "/api/",
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

  // If the user is logged in and has a passkey, enforce 2FA
  if (session?.user?.hasPasskey) {
    const tfaCookie = request.cookies.get("x-tfa")
    if (!tfaCookie?.value) {
      const verifyUrl = new URL("/verify", request.url)
      verifyUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(verifyUrl)
    }
  }

  return NextResponse.next()
}
