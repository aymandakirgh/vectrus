import { useRef, type ReactNode, type CSSProperties } from 'react'

/* Magnetic hover: the control leans toward the pointer while it is inside,
   then springs home on leave. Displacement is capped so it stays a lean,
   never a chase. Fine pointers only; touch gets a plain button. */
export function Magnetic({
  children,
  strength = 0.32,
  max = 10,
  className = '',
  style,
}: {
  children: ReactNode
  strength?: number
  max?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const x = Math.max(-max, Math.min(max, dx * strength))
    const y = Math.max(-max, Math.min(max, dy * strength))
    el.style.transition = 'transform 0.12s cubic-bezier(0.77,0,0.175,1)'
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.transition = 'transform 0.5s cubic-bezier(0.19,1,0.22,1)'
    el.style.transform = 'translate(0, 0)'
  }

  return (
    <div
      ref={ref}
      className={`inline-block ${className}`}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  )
}
