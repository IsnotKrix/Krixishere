import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative text-center max-w-md">
        {/* Error code */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-400/20 bg-red-400/5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-red-400 text-xs font-medium tracking-widest uppercase">
            Error 403
          </span>
        </div>

        <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 tracking-tight">
          403
        </h1>

        <h2 className="text-xl font-semibold text-zinc-300 mb-4">
          Access Forbidden
        </h2>

        <p className="text-zinc-500 text-sm leading-relaxed mb-10">
          You don&apos;t have permission to view this page.
          <br />
          If you think this is a mistake, feel free to reach out.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 text-sm font-medium transition-all duration-200"
          >
            ← Go home
          </Link>
          <Link
            href="/#contact"
            className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200"
          >
            Contact me
          </Link>
        </div>

        {/* Decorative */}
        <div className="mt-16 text-zinc-800 text-xs font-mono tracking-widest">
          krix<span className="text-orange-500">.</span>
        </div>
      </div>
    </div>
  );
}
