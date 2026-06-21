import { SignIn } from "@clerk/nextjs"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In — Krix",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SignIn
        routing="hash"
        fallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: "#5865F2",
            colorBackground: "hsl(var(--background))",
            colorInput: "hsl(var(--card))",
            colorForeground: "hsl(var(--foreground))",
            colorMutedForeground: "hsl(var(--muted-foreground))",
            borderRadius: "0.75rem",
            fontFamily: "var(--font-geist-sans)",
            fontFamilyButtons: "var(--font-geist-mono)",
          },
        }}
      />
    </div>
  )
}
