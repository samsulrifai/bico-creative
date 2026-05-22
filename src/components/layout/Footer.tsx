import { Link } from 'react-router-dom'
import {
  Share2,
  Link2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { SITE_NAME, NAV_LINKS } from '@/lib/constants'
import { useSettings, useServices } from '@/hooks/useSupabase'
import { dummySettings, dummyServices } from '@/lib/dummy-data'



export function Footer() {
  const { data: settings } = useSettings()
  const { data: services } = useServices()

  const cfg = settings ?? dummySettings
  const svc = services ?? dummyServices

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Share2,
      href: cfg.social_links.instagram ?? '#',
    },
    {
      name: 'LinkedIn',
      icon: Link2,
      href: cfg.social_links.linkedin ?? '#',
    },
    {
      name: 'Dribbble',
      icon: Globe,
      href: cfg.social_links.dribbble ?? '#',
    },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--inverse-surface)',
        color: 'var(--inverse-on-surface)',
      }}
    >
      {/* Decorative gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Main footer content */}
      <div className="container-bico pt-16 pb-8 lg:pt-20 lg:pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* ── Column 1: Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-2 mb-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 transition-colors duration-300 group-hover:bg-white/20">
                <span className="text-sm font-bold text-white">B</span>
              </div>
              <span className="text-xl font-bold tracking-tight">{SITE_NAME}</span>
            </Link>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs mb-6">
              Agency kreatif digital yang membantu brand Indonesia tampil
              memukau di dunia digital. Strategi, desain, dan teknologi dalam
              satu atap.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/15 hover:border-white/25 hover:scale-110"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest opacity-50">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-1 text-sm opacity-70 transition-all duration-200 hover:opacity-100 hover:translate-x-1"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: Services ── */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest opacity-50">
              Services
            </h4>
            <ul className="space-y-3">
              {svc.map((service) => (
                <li key={service.id}>
                  <Link
                    to="/services"
                    className="group inline-flex items-center gap-1 text-sm opacity-70 transition-all duration-200 hover:opacity-100 hover:translate-x-1"
                  >
                    {service.title}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 4: Contact Info ── */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest opacity-50">
              Contact
            </h4>
            <ul className="space-y-4">
              {cfg.contact_email && (
                <li>
                  <a
                    href={`mailto:${cfg.contact_email}`}
                    className="flex items-start gap-3 text-sm opacity-70 transition-opacity duration-200 hover:opacity-100"
                  >
                    <Mail className="size-4 mt-0.5 shrink-0" />
                    <span>{cfg.contact_email}</span>
                  </a>
                </li>
              )}
              {cfg.contact_phone && (
                <li>
                  <a
                    href={`tel:${cfg.contact_phone.replace(/\s/g, '')}`}
                    className="flex items-start gap-3 text-sm opacity-70 transition-opacity duration-200 hover:opacity-100"
                  >
                    <Phone className="size-4 mt-0.5 shrink-0" />
                    <span>{cfg.contact_phone}</span>
                  </a>
                </li>
              )}
              {cfg.contact_address && (
                <li className="flex items-start gap-3 text-sm opacity-70">
                  <MapPin className="size-4 mt-0.5 shrink-0" />
                  <span>{cfg.contact_address}</span>
                </li>
              )}
              {cfg.working_hours && (
                <li className="flex items-start gap-3 text-sm opacity-70">
                  <Clock className="size-4 mt-0.5 shrink-0" />
                  <span>{cfg.working_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs opacity-50">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-xs opacity-50 transition-opacity duration-200 hover:opacity-80"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-xs opacity-50 transition-opacity duration-200 hover:opacity-80"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
