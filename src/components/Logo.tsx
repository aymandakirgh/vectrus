import { Link } from 'react-router-dom'

/* The mark reads as a V and as a seismic section: three strata converging,
   each one deeper and fainter than the last. */
export function LogoMark({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <g stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8 L22 26 L40 8" />
        <path d="M10 14 L22 34 L34 14" opacity="0.55" />
        <path d="M16 20 L22 42 L28 20" opacity="0.28" />
      </g>
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Vectrus home"
      className={`flex items-center gap-3 hover:opacity-70 transition-opacity ${className}`}
    >
      <LogoMark />
      <span className="text-sm tracking-[0.35em] uppercase font-medium leading-none">Vectrus</span>
    </Link>
  )
}
