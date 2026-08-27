import { Link, NavLink, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { DARK, NAV_LINKS, STAGGER_EASE } from '@/lib/theme'
import { LogoMark } from '@/components/Logo'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation()
  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-500 ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      style={{ backgroundColor: DARK, transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
      aria-hidden={!open}
    >
      <div
        className={`h-full flex flex-col transition-transform duration-500 ${
          open ? 'translate-y-0' : '-translate-y-8'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 pt-8 sm:pt-12">
          <Link to="/" onClick={onClose} aria-label="Vectrus home" className="text-white hover:opacity-70 transition-opacity">
            <LogoMark size={26} />
          </Link>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/30 hover:border-white flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12">
          {NAV_LINKS.map((item, i) => {
            const active =
              item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`py-3 text-2xl sm:text-3xl font-light tracking-wide uppercase ${
                  active ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.6s ${STAGGER_EASE} ${i * 60}ms, transform 0.6s ${STAGGER_EASE} ${i * 60}ms, color 0.2s ease`,
                }}
              >
                {item.label}
              </NavLink>
            )
          })}
        </div>
        <div className="flex items-center gap-8 px-8 sm:px-12 pb-10">
          <Link
            to="/news"
            onClick={onClose}
            className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
          >
            NEWS
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </div>
    </div>
  )
}
