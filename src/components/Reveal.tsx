import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ARRIVE } from '@/lib/theme'

/* Scroll-triggered arrival. Fires once, ease-out-expo, because the element
   was not on screen before: arrival curve, not a morph. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  y = 26,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.9s ${ARRIVE} ${delay}ms, transform 0.9s ${ARRIVE} ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
