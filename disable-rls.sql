-- Jalankan script ini di menu SQL Editor pada Supabase Dashboard Anda
-- Ini akan mengizinkan akses CRUD untuk pengguna anonim (karena kita menggunakan mock auth lokal)

ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE about_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;
