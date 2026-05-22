import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { NAV_LINKS, SITE_NAME } from '@/lib/constants'
import { useSettings } from '@/hooks/useSupabase'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const { data: settings } = useSettings()

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50)
    }

    handleScroll() // Check initial state
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  function isActive(href: string) {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out',
        isScrolled
          ? 'bg-primary shadow-lg'
          : 'bg-primary'
      )}
    >
      <nav className="container-bico flex h-16 items-center justify-between lg:h-20">
        {/* ── Logo ── */}
        <Link
          to="/"
          className="group flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          {settings?.logo_url ? (
            <img 
              src={settings.logo_url} 
              alt={settings?.site_name || SITE_NAME} 
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white transition-transform duration-300 group-hover:scale-110">
              <span className="text-sm font-bold text-primary">
                {(settings?.site_name || SITE_NAME).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-xl font-bold text-primary-foreground tracking-tight">
            {settings?.site_name || SITE_NAME}
          </span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                  isActive(link.href)
                    ? 'text-primary-foreground bg-white/20'
                    : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-white transition-all duration-300" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Desktop CTA Button ── */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            className="rounded-full px-6 font-semibold bg-white text-primary hover:bg-white/90 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-100"
          >
            <Link to="/contact">Let's Talk</Link>
          </Button>
        </div>

        {/* ── Mobile Hamburger ── */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-full text-primary-foreground hover:bg-white/10"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* ── Mobile Sheet ── */}
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetContent side="right" className="w-80 p-0">
            <SheetHeader className="border-b px-6 py-5">
              <SheetTitle className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-xs font-bold text-white">B</span>
                </div>
                <span className="text-lg font-bold">{SITE_NAME}</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex flex-col px-4 py-6">
              {/* Nav Links */}
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      to={link.href}
                      className={cn(
                        'flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200',
                        isActive(link.href)
                          ? 'bg-primary/8 text-primary'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      )}
                    >
                      {link.label}
                      {isActive(link.href) && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              {/* CTA */}
              <div className="mt-8 px-4">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full rounded-full py-6 text-base font-semibold shadow-md"
                  >
                    <Link to="/contact">Let's Talk</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
