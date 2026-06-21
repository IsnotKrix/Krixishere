import Link from "next/link"

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
        }}
      />

      <div className="relative z-10 text-center max-w-sm">
        <div className="text-6xl mb-6 select-none" role="img" aria-label="restricted">
          ⛔
        </div>

        <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card">
          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
          <span className="text-muted-foreground text-[10px] font-mono tracking-[0.3em] uppercase">
            Access Denied — 403
          </span>
        </div>

        <h1 className="text-5xl font-bold text-foreground mb-3 font-mono tracking-tight">
          RESTRICTED
        </h1>

        <p className="text-muted-foreground text-xs font-mono leading-relaxed mb-8 tracking-wider">
          This route is off-limits.<br />
          You weren&apos;t supposed to find this.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30 text-xs font-mono tracking-widest uppercase transition-all duration-200"
        >
          ← return home
        </Link>

        <div className="mt-14 text-border text-[10px] font-mono tracking-widest select-none">
          krix<span className="text-muted-foreground/30">.</span>
        </div>
      </div>
    </div>
  )
}
