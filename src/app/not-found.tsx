import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-[10rem] font-black text-foreground/[0.04] leading-none select-none">
          404
        </p>
        <h1 className="text-2xl font-semibold text-foreground mt-2 mb-3">
          Lost in the void
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          This page doesn&apos;t exist or was moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-mono text-foreground/60 hover:text-foreground hover:border-foreground/30 hover:bg-foreground/[0.04] transition-all"
        >
          ← back to home
        </Link>
      </div>
    </div>
  )
}
