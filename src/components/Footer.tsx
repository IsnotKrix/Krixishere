export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
        <span>
          krix<span className="text-violet-400">.</span> — krixishere.org
        </span>
        <span>Built with Next.js & Tailwind CSS · {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
