"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SpiralLoader } from "@/components/agent-elements/spiral-loader";

const LOADER_SIZE = 42; // Adjust as needed to fit the design
const FADE_MS = 350;

function Overlay({ visible }: { visible: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0a]"
      style={{
        transition: `opacity ${FADE_MS}ms ease`,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
      }}
    >
      <SpiralLoader size={LOADER_SIZE} />
    </div>
  );
}

/* ── Initial load ─────────────────────────────────────────── */
function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 1000);
    const remove = setTimeout(() => setMounted(false), 1000 + FADE_MS + 50);
    return () => { clearTimeout(hide); clearTimeout(remove); };
  }, []);

  if (!mounted) return null;
  return <Overlay visible={visible} />;
}

const MIN_LOADER_MS = 1300;

/* ── Route-transition: show on click, hide on pathname change ── */
function TransitionLoader() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const shownAt = useRef<number | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Listen for internal link clicks → show loader immediately
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("http") || href.startsWith("#") ||
          href.startsWith("mailto") || href.startsWith("tel")) return;
      const target = new URL(href, window.location.href);
      if (target.pathname === window.location.pathname) return;

      clearTimeout(hideTimer.current);
      clearTimeout(removeTimer.current);
      shownAt.current = Date.now();
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // When pathname changes → wait for minimum display time, then fade out
  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    clearTimeout(hideTimer.current);
    clearTimeout(removeTimer.current);

    const elapsed = shownAt.current ? Date.now() - shownAt.current : MIN_LOADER_MS;
    const remaining = Math.max(0, MIN_LOADER_MS - elapsed);

    hideTimer.current = setTimeout(() => setVisible(false), remaining);
    removeTimer.current = setTimeout(() => setMounted(false), remaining + FADE_MS + 50);
  }, [pathname]);

  if (!mounted) return null;
  return <Overlay visible={visible} />;
}

export function PageLoader() {
  return (
    <>
      <InitialLoader />
      <TransitionLoader />
    </>
  );
}
