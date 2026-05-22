-- ============================================================
-- Bico Creative — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Site Settings (singleton)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Bico Creative',
  logo_url TEXT,
  favicon_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  working_hours TEXT,
  social_links JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Hero Content (singleton)
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT NOT NULL DEFAULT 'We Craft Digital Experiences That Matter',
  subheading TEXT,
  cta_primary_text TEXT DEFAULT 'Mulai Proyek',
  cta_primary_link TEXT DEFAULT '/contact',
  cta_secondary_text TEXT DEFAULT 'Lihat Portfolio',
  cta_secondary_link TEXT DEFAULT '/projects',
  background_image_url TEXT,
  client_logos JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  icon TEXT,
  image_url TEXT,
  features JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  client_name TEXT,
  thumbnail_url TEXT,
  gallery_images JSONB DEFAULT '[]',
  project_url TEXT,
  tech_stack JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  social_links JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  company TEXT,
  author_photo_url TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. About Content (singleton)
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  heading TEXT DEFAULT 'We''re Bico Creative',
  description TEXT,
  mission TEXT,
  vision TEXT,
  image_url TEXT,
  core_values JSONB DEFAULT '[]',
  stats JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Contact Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_interest TEXT,
  budget_range TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Enable Row Level Security
-- ============================================================

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies — Public read for active content
-- ============================================================

-- Site Settings: public read
CREATE POLICY "Public read site_settings" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

-- Hero: public read active
CREATE POLICY "Public read hero_content" ON hero_content
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- Services: public read active
CREATE POLICY "Public read services" ON services
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- Projects: public read active
CREATE POLICY "Public read projects" ON projects
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- Team: public read active
CREATE POLICY "Public read team_members" ON team_members
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- Testimonials: public read active
CREATE POLICY "Public read testimonials" ON testimonials
  FOR SELECT TO anon, authenticated USING (is_active = true);

-- About: public read
CREATE POLICY "Public read about_content" ON about_content
  FOR SELECT TO anon, authenticated USING (true);

-- Contact Submissions: public insert
CREATE POLICY "Public insert contact" ON contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- RLS Policies — Authenticated full access (admin)
-- ============================================================

CREATE POLICY "Auth manage site_settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth manage hero_content" ON hero_content
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth manage services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth manage projects" ON projects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth manage team_members" ON team_members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth manage testimonials" ON testimonials
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth manage about_content" ON about_content
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth read contact" ON contact_submissions
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- Seed Data
-- ============================================================

-- Seed site_settings
INSERT INTO site_settings (site_name, contact_email, contact_phone, contact_address, working_hours, social_links)
VALUES (
  'Bico Creative',
  'hello@bicocreative.com',
  '+62 812 3456 7890',
  'Jl. Sudirman No. 123, Jakarta Selatan, Indonesia 12190',
  'Mon - Fri: 09:00 - 18:00 WIB',
  '{"instagram": "https://instagram.com/bicocreative", "linkedin": "https://linkedin.com/company/bicocreative", "behance": "https://behance.net/bicocreative", "dribbble": "https://dribbble.com/bicocreative"}'
);

-- Seed hero_content
INSERT INTO hero_content (heading, subheading, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, client_logos)
VALUES (
  'We Craft Digital Experiences That Matter',
  'Bico Creative adalah agency kreatif yang membantu brand Anda tampil menonjol di dunia digital. Dari strategi hingga eksekusi, kami wujudkan visi Anda.',
  'Mulai Proyek',
  '/contact',
  'Lihat Portfolio',
  '/projects',
  '[{"name": "TechCorp", "logo_url": ""}, {"name": "StartupID", "logo_url": ""}, {"name": "GreenLeaf", "logo_url": ""}, {"name": "UrbanStyle", "logo_url": ""}, {"name": "DataFlow", "logo_url": ""}, {"name": "CloudNine", "logo_url": ""}]'
);

-- Seed services
INSERT INTO services (title, short_description, full_description, icon, features, sort_order) VALUES
('Brand Identity & Strategy', 'Bangun identitas brand yang kuat dan memorable. Dari logo hingga brand guideline yang komprehensif.', 'Kami membantu Anda membangun identitas brand yang tidak hanya indah, tapi juga strategis.', 'Palette', '["Logo Design", "Brand Guidelines", "Visual Identity System", "Brand Strategy", "Stationery Design"]', 0),
('UI/UX Design', 'Desain antarmuka yang intuitif dan pengalaman pengguna yang memikat. Research-driven dan user-centered.', 'Tim desainer kami menerapkan pendekatan user-centered design untuk menciptakan antarmuka yang cantik dan mudah digunakan.', 'Figma', '["User Research", "Wireframing", "Interactive Prototyping", "Usability Testing", "Design System"]', 1),
('Web Development', 'Website modern, cepat, dan responsif. Dibangun dengan teknologi terkini untuk performa optimal.', 'Kami membangun website dan web application menggunakan stack teknologi modern.', 'Code', '["Responsive Website", "Web Application", "CMS Development", "E-Commerce", "API Integration"]', 2),
('Digital Marketing', 'Strategi digital marketing yang terukur dan efektif. Dari SEO hingga social media management.', 'Kami merancang strategi digital marketing yang data-driven untuk ROI maksimal.', 'TrendingUp', '["SEO Optimization", "Social Media Management", "Content Strategy", "Google Ads", "Analytics"]', 3),
('Motion & Video', 'Konten visual yang dinamis dan engaging. Motion graphics dan video production berkualitas tinggi.', 'Dari motion graphics hingga video production, kami menciptakan konten visual yang menarik perhatian.', 'Video', '["Motion Graphics", "Video Production", "Animation", "Social Media Video", "Explainer Video"]', 4);

-- Seed projects
INSERT INTO projects (title, description, category, client_name, project_url, tech_stack, is_featured, sort_order) VALUES
('TechCorp Brand Refresh', 'Redesign identitas visual lengkap untuk perusahaan teknologi terkemuka.', 'Branding', 'TechCorp Indonesia', 'https://techcorp.id', '["Figma", "Illustrator", "After Effects"]', true, 0),
('GreenLeaf E-Commerce', 'Platform e-commerce untuk brand fashion sustainable.', 'Development', 'GreenLeaf Fashion', 'https://greenleaf.co.id', '["React", "Next.js", "Tailwind CSS", "Supabase"]', true, 1),
('UrbanStyle App Design', 'Desain aplikasi mobile untuk platform lifestyle dan fashion.', 'Web Design', 'UrbanStyle', null, '["Figma", "Protopie", "Principle"]', true, 2),
('DataFlow Dashboard', 'Dashboard analytics real-time untuk SaaS platform.', 'Development', 'DataFlow Analytics', 'https://dataflow.io', '["React", "TypeScript", "D3.js", "Node.js"]', true, 3),
('StartupID Campaign', 'Digital marketing campaign untuk peluncuran produk startup fintech.', 'Marketing', 'StartupID', null, '["Google Ads", "Meta Ads", "Analytics"]', false, 4),
('CloudNine Motion Reel', 'Motion graphics showreel dan explainer video series.', 'Motion', 'CloudNine Tech', null, '["After Effects", "Cinema 4D", "Premiere Pro"]', false, 5);

-- Seed team_members
INSERT INTO team_members (name, role, bio, social_links, sort_order) VALUES
('Andi Prasetyo', 'Founder & Creative Director', 'Dengan pengalaman lebih dari 10 tahun di industri kreatif.', '{"linkedin": "#", "dribbble": "#"}', 0),
('Sarah Wijaya', 'Head of Design', 'Ahli dalam UI/UX dan brand identity.', '{"linkedin": "#", "behance": "#"}', 1),
('Rizky Nugroho', 'Lead Developer', 'Full-stack developer yang passionate dengan clean code.', '{"linkedin": "#", "github": "#"}', 2),
('Maya Putri', 'Digital Strategist', 'Data-driven marketer dengan track record optimization.', '{"linkedin": "#", "instagram": "#"}', 3);

-- Seed testimonials
INSERT INTO testimonials (quote, author_name, author_role, company, rating, sort_order) VALUES
('Bico Creative benar-benar memahami visi kami. Hasil kerja mereka melampaui ekspektasi.', 'Diana Kusuma', 'CEO', 'TechCorp Indonesia', 5, 0),
('Tim yang sangat responsif dan kreatif. Website mereka membantu kami meningkatkan konversi hingga 200%.', 'Budi Santoso', 'Marketing Director', 'GreenLeaf Fashion', 5, 1),
('Proses kerja yang terstruktur dan transparan. Kolaborasi yang menyenangkan!', 'Putri Maharani', 'Product Manager', 'DataFlow Analytics', 5, 2);

-- Seed about_content
INSERT INTO about_content (heading, description, mission, vision, core_values, stats)
VALUES (
  'We''re Bico Creative',
  'Bico Creative adalah agency kreatif berbasis di Jakarta yang berdiri sejak 2018. Kami percaya bahwa desain yang baik bukan hanya soal estetika — tapi juga tentang strategi, cerita, dan dampak nyata bagi bisnis klien kami.',
  'Memberdayakan brand Indonesia dengan solusi kreatif digital yang inovatif, strategis, dan berdampak.',
  'Menjadi agency kreatif digital terdepan di Indonesia yang dikenal karena keunggulan desain, inovasi teknologi, dan dampak nyata.',
  '[{"title": "Kreativitas Tanpa Batas", "description": "Kami selalu mencari cara baru dan segar untuk menyelesaikan setiap tantangan kreatif."}, {"title": "Kolaborasi Erat", "description": "Kami percaya hasil terbaik lahir dari kolaborasi yang transparan dan terbuka."}, {"title": "Kualitas di Atas Segalanya", "description": "Setiap detail penting. Kami tidak berkompromi dengan kualitas."}]',
  '[{"label": "Projects Completed", "value": "150+"}, {"label": "Happy Clients", "value": "80+"}, {"label": "Years of Experience", "value": "7+"}, {"label": "Awards Won", "value": "12"}]'
);
