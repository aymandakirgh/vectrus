import { useEffect, useRef } from 'react'

/* Dot leads, ring lags: two followers on different time constants, the same
   leader-and-follower idea as the lab's trail springs. Blend-difference keeps
   it legible on the video scene and on paper alike. Fine pointers only. */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('cursor-armed')

    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let dx = tx
    let dy = ty
    let rx = tx
    let ry = ty
    let hot = false
    let visible = false
    let raf = 0
    let last = performance.now()

    const isInteractive = (t: EventTarget | null) =>
      t instanceof Element &&
      !!t.closest('a, button, [role="button"], input, textarea, select, summary, label')

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      hot = isInteractive(e.target)
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onDown = () => {
      ring.style.setProperty('--press', '0.82')
    }
    const onUp = () => {
      ring.style.setProperty('--press', '1')
    }

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // dot: fast follower; ring: slow follower that makes the lag visible
      const kDot = 1 - Math.exp(-dt * 34)
      const kRing = 1 - Math.exp(-dt * 14)
      dx += (tx - dx) * kDot
      dy += (ty - dy) * kDot
      rx += (tx - rx) * kRing
      ry += (ty - ry) * kRing
      const scale = hot ? 1.7 : 1
      dot.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0) scale(${hot ? 0.5 : 1})`
      ring.style.transform = `translate3d(${rx - 16}px, ${ry - 16}px, 0) scale(calc(${scale} * var(--press, 1)))`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('cursor-armed')
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]" aria-hidden="true">
      <div
        ref={dotRef}
        className="absolute top-0 left-0 w-2 h-2 rounded-full bg-white opacity-0 transition-opacity duration-300"
        style={{ mixBlendMode: 'difference' }}
      />
      <div
        ref={ringRef}
        className="absolute top-0 left-0 w-8 h-8 rounded-full border border-white/70 opacity-0 transition-opacity duration-300"
        style={{ mixBlendMode: 'difference' }}
      />
    </div>
  )
}
