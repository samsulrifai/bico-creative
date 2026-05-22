import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollToTop } from '@/components/layout/ScrollToTop'

export default function PublicLayout() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(window.scrollY > 500)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />

      {/* Main content area — offset by navbar height */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* ── Floating Scroll-to-Top Button ── */}
      <Button
        variant="default"
        size="icon"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={cn(
          'fixed bottom-6 right-6 z-50 size-12 rounded-full shadow-lg transition-all duration-500',
          'bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:scale-110 active:scale-95',
          showScrollTop
            ? 'translate-y-0 opacity-100'
            : 'translate-y-4 opacity-0 pointer-events-none'
        )}
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  )
}
