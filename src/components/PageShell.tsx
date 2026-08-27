import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { MobileMenu } from '@/components/MobileMenu'
import { Footer } from '@/components/Footer'

/* Shell for every inner page: fixed navy-on-paper navbar, overlay menu,
   footer, per-route title, and an arrival animation keyed to the route. */
export function PageShell({ title, children }: { title: string; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.title = `${title} · Vectrus`
  }, [title])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <Navbar isLight={false} fixed onOpenMenu={() => setMenuOpen(true)} />
      <main key={location.pathname} className="page-in min-h-screen">
        {children}
      </main>
      <Footer />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
