"use client"

import { useRef, useCallback, useEffect } from "react"

interface PixelTrailProps {
  pixelSize?: number
  fadeDuration?: number
  delay?: number
  className?: string
  pixelClassName?: string // kept for API compat
}

export function PixelTrail({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
}: PixelTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activePixels = useRef<Map<string, number>>(new Map())
  const rafRef = useRef(0)
  const loopingRef = useRef(false)
  const dprRef = useRef(1)
  const enabledRef = useRef(false)

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none)").matches
    ) {
      return
    }
    enabledRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    dprRef.current = dpr

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const w = parent.clientWidth
      const h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const startLoop = useCallback(() => {
    if (loopingRef.current) return
    loopingRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const tick = (now: number) => {
      const dpr = dprRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const expired: string[] = []
      for (const [key, startTime] of activePixels.current) {
        const elapsed = now - startTime - delay
        if (elapsed < 0) continue
        const t = elapsed / fadeDuration
        if (t >= 1) {
          expired.push(key)
          continue
        }

        const [col, row] = key.split(",").map(Number)
        const cx = (col * pixelSize + pixelSize / 2) * dpr
        const cy = (row * pixelSize + pixelSize / 2) * dpr
        const r = (pixelSize / 2) * dpr

        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${(1 - t) * 0.4})`
        ctx.fill()
      }

      for (const k of expired) activePixels.current.delete(k)

      if (activePixels.current.size > 0) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        loopingRef.current = false
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [delay, fadeDuration, pixelSize])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabledRef.current) return
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const col = Math.floor((e.clientX - rect.left) / pixelSize)
      const row = Math.floor((e.clientY - rect.top) / pixelSize)
      activePixels.current.set(`${col},${row}`, performance.now())
      startLoop()
    },
    [pixelSize, startLoop]
  )

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-auto${className ? ` ${className}` : ""}`}
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  )
}
