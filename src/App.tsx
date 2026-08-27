import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import Upstream from '@/pages/Upstream'
import Markets from '@/pages/Markets'
import Systems from '@/pages/Systems'
import Plus from '@/pages/Plus'
import News from '@/pages/News'
import Contact from '@/pages/Contact'
import { Cursor } from '@/components/Cursor'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Cursor />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upstream" element={<Upstream />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/systems" element={<Systems />} />
        <Route path="/plus" element={<Plus />} />
        <Route path="/news" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
