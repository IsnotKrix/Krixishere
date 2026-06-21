"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { ConsentDialog } from "@/components/ConsentDialog"
import { useState } from "react"

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/"
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push(callbackUrl)
    }
  }, [isLoaded, isSignedIn, router, callbackUrl])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setOpen(true)
    }
  }, [isLoaded, isSignedIn])

  return (
    <ConsentDialog
      open={open}
      onClose={() => router.push("/")}
      callbackUrl={callbackUrl}
    />
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
