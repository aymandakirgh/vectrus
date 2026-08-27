import { useEffect, useRef } from 'react'
import { DARK } from '@/lib/theme'

/* Topographic contours: nested closed loops whose radius is modulated by a sum
   of incommensurate sines, drifting very slowly. Layered-sine noise keeps it
   organic without a noise library. Static frame under reduced motion. */
export function TopoField({
  rings = 14,
  className = '',
  opacity = 0.14,
}: {
  rings?: number
  className?: string
  opacity?: number
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
    let dpr = 1

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const wobble = (a: number, ring: number, t: number) =>
      Math.sin(a * 3 + ring * 0.9 + t * 0.21) * 14 +
      Math.sin(a * 5 - ring * 1.7 + t * 0.13) * 9 +
      Math.sin(a * 8 + ring * 2.3 - t * 0.17) * 5

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const cx = w * 0.72
      const cy = h * 0.46
      const maxR = Math.max(w, h) * 0.72
      ctx.strokeStyle = DARK
      ctx.lineWidth = 1
      for (let i = 1; i <= rings; i++) {
        const base = (maxR / rings) * i
        ctx.globalAlpha = opacity * (1 - (i / rings) * 0.45)
        ctx.beginPath()
        const steps = 140
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2
          const r = base + wobble(a, i, t)
          const x = cx + Math.cos(a) * r
          const y = cy + Math.sin(a) * r * 0.86
          if (s === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    if (reduced) {
      draw(0)
    } else {
      const loop = (now: number) => {
        draw(now / 1000)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [rings, opacity])

  return <canvas ref={ref} className={`block w-full h-full ${className}`} aria-hidden="true" />
}
