import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type {
  SiteSettings,
  HeroContent,
  Service,
  Project,
  TeamMember,
  Testimonial,
  AboutContent,
} from '@/types/database'

// ─── Site Settings ───
export function useSettings() {
  return useQuery<SiteSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .limit(1)
        .single()
      if (error) throw error
      return data
    },
  })
}

// ─── Hero Content ───
export function useHero() {
  return useQuery<HeroContent>({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()
      if (error) throw error
      return data
    },
  })
}

// ─── Services ───
export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

// ─── Projects ───
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

// ─── Team Members ───
export function useTeam() {
  return useQuery<TeamMember[]>({
    queryKey: ['team'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

// ─── Testimonials ───
export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw error
      return data ?? []
    },
  })
}

// ─── About Content ───
export function useAbout() {
  return useQuery<AboutContent>({
    queryKey: ['about'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single()
      if (error) throw error
      return data
    },
  })
}
