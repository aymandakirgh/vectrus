import { Link } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { DARK, NAV_LINKS } from '@/lib/theme'
import { LogoMark } from '@/components/Logo'
import { Magnetic } from '@/components/MagneticButton'

export function Footer() {
  return (
    <footer className="text-white" style={{ backgroundColor: DARK }}>
      <div className="px-6 sm:px-8 md:px-12 pt-16 sm:pt-24 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <LogoMark size={28} />
              <span className="text-sm tracking-[0.35em] uppercase font-medium">Vectrus</span>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-white/60">
              An integrated energy group: exploration, trading, infrastructure, and the ventures
              after them. Headquartered in Oslo, at work on four continents.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-10">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">Group</p>
              <ul className="space-y-3">
                {NAV_LINKS.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide"
                    >
                      {item.label.replace('VECTRUS ', '') || 'Energy'}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">Desk</p>
              <ul className="space-y-3">
                <li>
                  <Link to="/news" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors uppercase tracking-wide">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Magnetic>
            <button
              aria-label="Back to top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full border border-white/30 hover:border-white flex items-center justify-center transition-colors"
            >
              <ArrowUp size={18} />
            </button>
          </Magnetic>
        </div>

        <div
          className="mt-16 sm:mt-24 select-none font-light uppercase leading-none tracking-tight text-white/10"
          style={{ fontSize: 'clamp(4rem, 15vw, 14rem)' }}
          aria-hidden="true"
        >
          Vectrus
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-white/40 tracking-wide">
          <span>© 2026 Vectrus Group. A concept study.</span>
          <span className="uppercase tracking-[0.2em]">Oslo · Geneva · Houston · Singapore</span>
        </div>
      </div>
    </footer>
  )
}
