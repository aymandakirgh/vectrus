import { useEffect, useState, type CSSProperties } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Info } from 'lucide-react'
import { DARK, NAV_LINKS, STAGGER_EASE } from '@/lib/theme'
import { LogoMark } from '@/components/Logo'

export function Navbar({
  isLight,
  fixed = false,
  onOpenMenu,
}: {
  isLight: boolean
  fixed?: boolean
  onOpenMenu: () => void
}) {
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 200)
    return () => clearTimeout(t)
  }, [])

  const color = isLight ? '#ffffff' : DARK
  const entrance = (delay: number): CSSProperties => ({
    opacity: entered ? 1 : 0,
    transform: entered ? 'translateY(0)' : 'translateY(-12px)',
    transition: `opacity 0.6s ${STAGGER_EASE} ${delay}ms, transform 0.6s ${STAGGER_EASE} ${delay}ms`,
  })

  return (
    <nav
      className={`${
        fixed ? 'fixed' : 'absolute'
      } top-0 left-0 right-0 z-50 pointer-events-auto flex items-center justify-between px-6 sm:px-8 md:px-12 pt-8 sm:pt-12 pb-6 transition-colors duration-500`}
      style={{ color }}
    >
      <button
        aria-label="Open menu"
        onClick={onOpenMenu}
        className="lg:hidden flex flex-col gap-[5px]"
        style={entrance(100)}
      >
        <span className="block w-6 h-[2px] transition-colors duration-500" style={{ backgroundColor: color }} />
        <span className="block w-6 h-[2px] transition-colors duration-500" style={{ backgroundColor: color }} />
        <span className="block w-4 h-[2px] transition-colors duration-500" style={{ backgroundColor: color }} />
      </button>

      <Link
        to="/"
        aria-label="Vectrus home"
        className="lg:hidden absolute left-1/2 -translate-x-1/2 hover:opacity-70 transition-opacity"
        style={entrance(180)}
      >
        <LogoMark size={24} />
      </Link>

      <div className="hidden lg:flex items-center gap-8 xl:gap-10">
        <Link to="/" aria-label="Vectrus home" className="hover:opacity-70 transition-opacity" style={entrance(60)}>
          <LogoMark size={24} />
        </Link>
        {NAV_LINKS.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="relative text-xs tracking-[0.15em] uppercase font-medium hover:opacity-70"
            style={entrance(i * 80 + 100)}
          >
            {({ isActive }) => (
              <>
                {item.label}
                <span
                  className="absolute -bottom-3 left-0 h-[2px] transition-all duration-500"
                  style={{
                    backgroundColor: 'currentColor',
                    width: isActive ? '100%' : '0%',
                  }}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-8" style={entrance(500)}>
        <Link to="/news" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          <span className="text-xs tracking-[0.2em] uppercase font-medium">NEWS</span>
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-500"
            style={{ backgroundColor: color }}
          >
            <Info size={10} style={{ color: isLight ? DARK : '#ffffff' }} />
          </span>
        </Link>
        <button
          onClick={onOpenMenu}
          className="text-xs tracking-[0.2em] uppercase font-medium hover:opacity-70 transition-opacity"
        >
          MENU
        </button>
      </div>
    </nav>
  )
}
