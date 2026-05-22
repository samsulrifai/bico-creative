import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xftsgolenohyqtrnrnqi.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdHNnb2xlbm9oeXF0cm5ybnFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODI0MTMsImV4cCI6MjA5NDk1ODQxM30.ovjFyTg0vsn6gkj-K1qJCO1lsd2glTbxb0AWTKFhK5I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
