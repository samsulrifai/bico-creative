import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'
import AdminSidebar from './AdminSidebar'
import AdminTopBar from './AdminTopBar'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/admin/hooks/useAuth'
import { ADMIN_NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Sparkles,
  Settings,
  FolderOpen,
  Users,
  MessageSquareQuote,
  Info,
  Cog,
  LogOut,
  ExternalLink,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Sparkles,
  Settings,
  FolderOpen,
  Users,
  MessageSquareQuote,
  Info,
  Cog,
}

export default function AdminLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      </div>

      {/* Mobile sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">Admin navigation links</SheetDescription>
          {/* Mobile nav content */}
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center gap-1 border-b border-border px-4">
              <span className="text-xl font-bold text-primary">Bico</span>
              <span className="text-sm font-medium text-muted-foreground">Admin</span>
            </div>

            <ScrollArea className="flex-1 py-4">
              <nav className="flex flex-col gap-1 px-3">
                {ADMIN_NAV_LINKS.map((link) => {
                  const Icon = iconMap[link.icon]
                  const isActive =
                    link.href === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(link.href)
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      {Icon && <Icon className={cn('size-5 shrink-0', isActive && 'text-primary')} />}
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>

            <div className="border-t border-border p-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ExternalLink className="size-5" />
                <span>View Site</span>
              </a>
              <Separator className="my-2" />
              <Button
                variant="ghost"
                onClick={() => { signOut(); setMobileOpen(false) }}
                className="w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300',
          'lg:ml-[260px]',
          sidebarCollapsed && 'lg:ml-[70px]'
        )}
      >
        <AdminTopBar onMobileMenuToggle={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
