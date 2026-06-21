import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Passkey 2FA proxy — awaiting migration to Clerk-based auth
export async function proxy(_request: NextRequest) {
  return NextResponse.next()
}
