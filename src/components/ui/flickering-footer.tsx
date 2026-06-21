"use client"

import { ChevronRightIcon } from "@radix-ui/react-icons"
import { ClassValue, clsx } from "clsx"
import * as Color from "color-bits"
import Link from "next/link"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { PixelTrail } from "@/components/ui/pixel-trail"
import { GooeyFilter } from "@/components/ui/gooey-filter"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback: string = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback
  if (!cssColor) return fallback
  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const el = document.createElement("div")
      el.style.color = cssColor
      document.body.appendChild(el)
      const computed = window.getComputedStyle(el).color
      document.body.removeChild(el)
      return Color.formatRGBA(Color.parse(computed))
    }
    return Color.formatRGBA(Color.parse(cssColor as string))
  } catch {
    return fallback
  }
}

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity))
}

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
  text?: string
  fontSize?: number
  fontWeight?: number | string
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#6B7280",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 90,
  fontWeight = 600,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  const memoizedColor = useMemo(() => getRGBA(color), [color])

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, w, h)
      const maskCanvas = document.createElement("canvas")
      maskCanvas.width = w
      maskCanvas.height = h
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true })
      if (!maskCtx) return
      if (text) {
        maskCtx.save()
        maskCtx.scale(dpr, dpr)
        maskCtx.fillStyle = "white"
        maskCtx.font = `${fontWeight} ${fontSize}px "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
        maskCtx.textAlign = "center"
        maskCtx.textBaseline = "middle"
        maskCtx.fillText(text, w / (2 * dpr), h / (2 * dpr))
        maskCtx.restore()
      }
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr
          const y = j * (squareSize + gridGap) * dpr
          const sw = squareSize * dpr
          const sh = squareSize * dpr
          const maskData = maskCtx.getImageData(x, y, sw, sh).data
          const hasText = maskData.some((v, idx) => idx % 4 === 0 && v > 0)
          const opacity = squares[i * rows + j]
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity
          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity)
          ctx.fillRect(x, y, sw, sh)
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  )

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      const cols = Math.ceil(w / (squareSize + gridGap))
      const rows = Math.ceil(h / (squareSize + gridGap))
      const squares = new Float32Array(cols * rows)
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity
      }
      return { cols, rows, squares, dpr }
    },
    [squareSize, gridGap, maxOpacity],
  )

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
        }
      }
    },
    [flickerChance, maxOpacity],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let gridParams: ReturnType<typeof setupCanvas>

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth
      const newHeight = height || container.clientHeight
      setCanvasSize({ width: newWidth, height: newHeight })
      gridParams = setupCanvas(canvas, newWidth, newHeight)
    }

    updateCanvasSize()

    let lastTime = 0
    const animate = (time: number) => {
      if (!isInView) return
      const deltaTime = (time - lastTime) / 1000
      lastTime = time
      updateSquares(gridParams.squares, deltaTime)
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr)
      animationFrameId = requestAnimationFrame(animate)
    }

    const ro = new ResizeObserver(updateCanvasSize)
    ro.observe(container)
    const io = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { threshold: 0 })
    io.observe(canvas)

    if (isInView) animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      ro.disconnect()
      io.disconnect()
    }
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView])

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  )
}

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)
  useEffect(() => {
    const check = () => setValue(window.matchMedia(query).matches)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [query])
  return value
}

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { title: "Home", url: "/" },
      { title: "Changelog", url: "/changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", url: "/privacy" },
      { title: "Terms of Service", url: "/terms" },
    ],
  },
  {
    title: "Social",
    links: [
      { title: "GitHub", url: "https://github.com/isnotkrix/krixishere" },
      { title: "Roblox", url: "https://www.roblox.com" },
    ],
  },
]

export function FlickeringFooter() {
  const tablet = useMediaQuery("(max-width: 1024px)")

  return (
    <footer className="w-full pb-0 border-t border-white/[0.04]">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between px-10 pt-10 pb-4">
        <div className="flex flex-col items-start gap-y-3 max-w-xs mx-0 mb-8 md:mb-0">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tight font-mono">
              krix<span className="text-zinc-600">.</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-600 font-mono leading-relaxed tracking-wide">
            Roblox developer &amp; web builder.
            <br />
            Building things that matter.
          </p>
        </div>

        <div className="md:w-1/2">
          <div className="flex flex-col md:flex-row md:justify-between gap-y-6 gap-x-8">
            {footerLinks.map((column, i) => (
              <ul key={i} className="flex flex-col gap-y-2">
                <li className="mb-1 text-[10px] font-mono font-semibold text-zinc-600 uppercase tracking-widest">
                  {column.title}
                </li>
                {column.links.map((link, j) => (
                  <li
                    key={j}
                    className="group inline-flex cursor-pointer items-center gap-1 text-xs text-zinc-600 hover:text-zinc-300 transition-colors font-mono"
                  >
                    <Link href={link.url}>{link.title}</Link>
                    <div className="flex size-3.5 items-center justify-center border border-zinc-800 rounded translate-x-0 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
                      <ChevronRightIcon className="size-2.5 text-zinc-500" />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-40 md:h-56 relative mt-8 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-background z-10 from-40%" />
        <div className="absolute inset-0 mx-6">
          <FlickeringGrid
            text={tablet ? "Krix" : "krixishere.org"}
            fontSize={tablet ? 64 : 80}
            fontWeight={700}
            className="h-full w-full"
            squareSize={2}
            gridGap={tablet ? 2 : 3}
            color="#6B7280"
            maxOpacity={0.25}
            flickerChance={0.1}
          />
        </div>
        <GooeyFilter id="gooey-filter-footer" strength={6} />
        <div className="absolute inset-0 z-20" style={{ filter: "url(#gooey-filter-footer)" }}>
          <PixelTrail
            pixelSize={tablet ? 16 : 20}
            fadeDuration={500}
            delay={0}
            pixelClassName="bg-white/20 rounded-full"
          />
        </div>
      </div>
    </footer>
  )
}
