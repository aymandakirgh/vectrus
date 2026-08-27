import type { ReactNode } from 'react'

/* Constant motion is the one case linear belongs. Content is doubled so the
   -50% translate loops seamlessly. */
export function Marquee({
  children,
  duration = 36,
  className = '',
}: {
  children: ReactNode
  duration?: number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="marquee-track flex w-max items-center"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        <div className="flex items-center shrink-0">{children}</div>
        <div className="flex items-center shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
