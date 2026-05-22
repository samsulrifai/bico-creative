export const SITE_NAME = 'Bico Creative'

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
] as const

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Hero', href: '/admin/hero', icon: 'Sparkles' },
  { label: 'Services', href: '/admin/services', icon: 'Settings' },
  { label: 'Projects', href: '/admin/projects', icon: 'FolderOpen' },
  { label: 'Team', href: '/admin/team', icon: 'Users' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: 'MessageSquareQuote' },
  { label: 'About', href: '/admin/about', icon: 'Info' },
  { label: 'Settings', href: '/admin/settings', icon: 'Cog' },
] as const

export const SERVICE_CATEGORIES = [
  'All',
  'Branding',
  'Web Design',
  'Development',
  'Marketing',
  'Motion',
] as const

export const BUDGET_RANGES = [
  'Under Rp 5 Juta',
  'Rp 5 - 15 Juta',
  'Rp 15 - 50 Juta',
  'Rp 50 - 100 Juta',
  'Above Rp 100 Juta',
] as const

export const WHATSAPP_NUMBER = '6281234567890' // Update with actual number
