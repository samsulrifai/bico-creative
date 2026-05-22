import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dummyServices, dummyProjects, dummyTeam, dummyTestimonials } from '@/lib/dummy-data'
import { Card, CardContent } from '@/components/ui/card'
import {
  Settings,
  FolderOpen,
  Users,
  MessageSquareQuote,
  Sparkles,
  ArrowRight,
  Cog,
  Info,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const stats = [
  {
    label: 'Total Services',
    value: dummyServices.length,
    icon: Settings,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
  },
  {
    label: 'Total Projects',
    value: dummyProjects.length,
    icon: FolderOpen,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-100',
  },
  {
    label: 'Total Team',
    value: dummyTeam.length,
    icon: Users,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-100',
  },
  {
    label: 'Total Testimonials',
    value: dummyTestimonials.length,
    icon: MessageSquareQuote,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-100',
  },
]

const quickActions = [
  { label: 'Edit Hero', href: '/admin/hero', icon: Sparkles, description: 'Update hero section content' },
  { label: 'Manage Services', href: '/admin/services', icon: Settings, description: 'Add or edit services offered' },
  { label: 'Manage Projects', href: '/admin/projects', icon: FolderOpen, description: 'Curate your portfolio' },
  { label: 'Manage Team', href: '/admin/team', icon: Users, description: 'Update team members' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote, description: 'Manage client reviews' },
  { label: 'Edit About', href: '/admin/about', icon: Info, description: 'Update company info' },
  { label: 'Site Settings', href: '/admin/settings', icon: Cog, description: 'Configure site settings' },
]

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard — Bico Admin'
  }, [])

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Selamat datang di panel admin Bico Creative
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={cn(
              'group relative overflow-hidden border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5',
              stat.borderColor
            )}
          >
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', stat.bgColor)}>
                <stat.icon className={cn('size-6', stat.color)} />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
            {/* Subtle gradient decoration */}
            <div className={cn('absolute -right-6 -top-6 size-24 rounded-full opacity-10', stat.bgColor)} />
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="size-5 text-primary" />
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="group h-full border transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-3.5 p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                    <action.icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                      {action.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
