import { useLocation } from 'react-router-dom'
import { useAuth } from '@/admin/hooks/useAuth'
import { ADMIN_NAV_LINKS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Menu } from 'lucide-react'

interface AdminTopBarProps {
  onMobileMenuToggle: () => void
}

export default function AdminTopBar({ onMobileMenuToggle }: AdminTopBarProps) {
  const location = useLocation()
  const { user } = useAuth()

  // Determine current page label from nav links
  const currentPage = ADMIN_NAV_LINKS.find((link) => {
    if (link.href === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(link.href)
  })

  const pageLabel = currentPage?.label || 'Dashboard'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      {/* Left side: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuToggle}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="size-5" />
        </Button>

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin" className="text-muted-foreground hover:text-foreground">
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pageLabel !== 'Dashboard' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
            {pageLabel === 'Dashboard' && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right side: user info */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold leading-tight">{user?.name || 'Admin'}</p>
          <p className="text-xs text-muted-foreground">{user?.role || 'Admin'}</p>
        </div>
        <Avatar className="size-9 bg-primary text-primary-foreground">
          <div className="flex size-full items-center justify-center text-sm font-bold">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>
        </Avatar>
      </div>
    </header>
  )
}
