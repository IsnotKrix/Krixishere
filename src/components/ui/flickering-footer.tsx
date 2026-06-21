"use client"

import { useEffect, useRef } from "react"

function FlickeringGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cellSize = 5
    const maxOpacity = 0.09
    const flickerChance = 0.05

    let cols: number
    let rows: number
    let opacities: Float32Array

    const setup = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      cols = Math.ceil(rect.width / cellSize)
      rows = Math.ceil(rect.height / cellSize)
      opacities = new Float32Array(cols * rows)
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      for (let i = 0; i < opacities.length; i++) {
        if (Math.random() < flickerChance) {
          opacities[i] = Math.random() * maxOpacity
        }
        const col = i % cols
        const row = Math.floor(i / cols)
        ctx.fillStyle = `rgba(255,255,255,${opacities[i]})`
        ctx.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1)
      }
      animRef.current = requestAnimationFrame(draw)
    }

    setup()
    draw()

    const ro = new ResizeObserver(setup)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  )
}

export function FlickeringFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative w-full h-24 overflow-hidden border-t border-white/[0.04]">
      <FlickeringGrid />
      <div className="relative z-10 h-full flex items-center justify-between px-8">
        <span className="text-[10px] font-mono text-zinc-800 tracking-[0.25em] uppercase select-none">
          krix<span className="text-zinc-700">.</span>
        </span>
        <span className="text-[10px] font-mono text-zinc-800 tracking-[0.2em] select-none">
          © {year}
        </span>
      </div>
    </footer>
  )
}
