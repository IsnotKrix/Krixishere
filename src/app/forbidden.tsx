import Link from "next/link"

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
        }}
      />

      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-sm">
        {/* Emoji */}
        <div className="text-6xl mb-6 select-none" role="img" aria-label="restricted">
          ⛔
        </div>

        {/* Status badge */}
        <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-900/50 bg-red-950/30">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-red-500 text-[10px] font-mono tracking-[0.3em] uppercase">
            Access Denied — 403
          </span>
        </div>

        <h1 className="text-5xl font-bold text-white mb-3 font-mono tracking-tight">
          RESTRICTED
        </h1>

        <p className="text-zinc-600 text-xs font-mono leading-relaxed mb-8 tracking-wider">
          This route is off-limits.<br />
          You weren&apos;t supposed to find this.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/8 bg-white/[0.03] text-zinc-500 hover:text-zinc-200 hover:border-white/20 text-xs font-mono tracking-widest uppercase transition-all duration-200"
        >
          ← return home
        </Link>

        <div className="mt-14 text-zinc-900 text-[10px] font-mono tracking-widest select-none">
          krix<span className="text-zinc-700">.</span>
        </div>
      </div>
    </div>
  )
}
