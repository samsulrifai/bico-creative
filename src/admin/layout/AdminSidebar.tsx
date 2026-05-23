import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/admin/hooks/useAuth'
import { ADMIN_NAV_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

// Map icon name strings to actual Lucide icon components
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

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b border-border px-4', collapsed ? 'justify-center' : 'gap-1')}>
        {collapsed ? (
          <span className="text-xl font-bold text-primary">B</span>
        ) : (
          <Link to="/admin" className="flex items-baseline gap-1 transition-opacity hover:opacity-80">
            <span className="text-xl font-bold text-primary">Bico</span>
            <span className="text-sm font-medium text-muted-foreground">Admin</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon]
            const isActive =
              link.href === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(link.href)

            const navItem = (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                {Icon && <Icon className={cn('size-5 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-accent-foreground')} />}
                {!collapsed && <span>{link.label}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={link.href} delayDuration={0}>
                  <TooltipTrigger asChild>{navItem}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {link.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navItem
          })}
        </nav>
      </ScrollArea>

      {/* Bottom actions */}
      <div className="border-t border-border p-3">
        {/* View site link */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ExternalLink className="size-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              View Site
            </TooltipContent>
          </Tooltip>
        ) : (
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ExternalLink className="size-5" />
            <span>View Site</span>
          </a>
        )}

        <Separator className="my-2" />

        {/* Collapse toggle */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggle} className="w-full">
                <PanelLeftOpen className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Expand Sidebar
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="ghost" onClick={onToggle} className="w-full justify-start gap-3 px-3">
            <PanelLeftClose className="size-5" />
            <span>Collapse</span>
          </Button>
        )}

        {/* Logout */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={signOut} className="mt-1 w-full text-destructive hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              Logout
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="ghost" onClick={signOut} className="mt-1 w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="size-5" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </aside>
  )
}
