import { useEffect, useRef } from 'react'
import { DARK } from '@/lib/theme'

/* Drifting nodes joined when close: link alpha falls off with distance so the
   mesh breathes instead of flickering. Deterministic seed keeps every visit
   identical. Static frame under reduced motion. */
export function NetworkField({
  count = 42,
  className = '',
  linkDist = 150,
}: {
  count?: number
  className?: string
  linkDist?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // mulberry32: tiny deterministic PRNG
    let seed = 20260827
    const rand = () => {
      seed |= 0
      seed = (seed + 0x6d2b79f5) | 0
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }

    const nodes = Array.from({ length: count }, () => ({
      x: rand(),
      y: rand(),
      vx: (rand() - 0.5) * 0.012,
      vy: (rand() - 0.5) * 0.012,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = DARK
      ctx.strokeStyle = DARK
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = (a.x - b.x) * w
          const dy = (a.y - b.y) * h
          const d = Math.hypot(dx, dy)
          if (d < linkDist) {
            ctx.globalAlpha = 0.13 * (1 - d / linkDist)
            ctx.beginPath()
            ctx.moveTo(a.x * w, a.y * h)
            ctx.lineTo(b.x * w, b.y * h)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.globalAlpha = 0.4
        ctx.beginPath()
        ctx.arc(n.x * w, n.y * h, 1.4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx / 60
        n.y += n.vy / 60
        if (n.x < 0 || n.x > 1) n.vx *= -1
        if (n.y < 0 || n.y > 1) n.vy *= -1
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    if (reduced) draw()
    else raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [count, linkDist])

  return <canvas ref={ref} className={`block w-full h-full ${className}`} aria-hidden="true" />
}
