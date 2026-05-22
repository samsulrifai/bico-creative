/* ===== Database Types for Supabase ===== */

export interface SiteSettings {
  id: string
  site_name: string
  logo_url: string | null
  favicon_url: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_address: string | null
  working_hours: string | null
  social_links: Record<string, string>
  updated_at: string
}

export interface HeroContent {
  id: string
  heading: string
  subheading: string | null
  cta_primary_text: string | null
  cta_primary_link: string | null
  cta_secondary_text: string | null
  cta_secondary_link: string | null
  background_image_url: string | null
  client_logos: ClientLogo[]
  is_active: boolean
  updated_at: string
}

export interface ClientLogo {
  name: string
  logo_url: string
}

export interface Service {
  id: string
  title: string
  short_description: string | null
  full_description: string | null
  icon: string | null
  image_url: string | null
  features: string[]
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  category: string | null
  client_name: string | null
  thumbnail_url: string | null
  gallery_images: string[]
  project_url: string | null
  tech_stack: string[]
  is_featured: boolean
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  social_links: Record<string, string>
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  quote: string
  author_name: string
  author_role: string | null
  company: string | null
  author_photo_url: string | null
  rating: number | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AboutContent {
  id: string
  heading: string | null
  description: string | null
  mission: string | null
  vision: string | null
  image_url: string | null
  core_values: CoreValue[]
  stats: Stat[]
  updated_at: string
}

export interface CoreValue {
  title: string
  description: string
}

export interface Stat {
  label: string
  value: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  service_interest: string | null
  budget_range: string | null
  message: string
  created_at: string
}
