import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import PublicLayout from '@/components/layout/PublicLayout'

// Public pages (eager load for fast initial render)
import Home from '@/pages/Home'
import About from '@/pages/About'
import Services from '@/pages/Services'
import Projects from '@/pages/Projects'
import Contact from '@/pages/Contact'

// Admin pages (lazy loaded)
const AdminLayout = lazy(() => import('@/admin/layout/AdminLayout'))
const Login = lazy(() => import('@/admin/pages/Login'))
const Dashboard = lazy(() => import('@/admin/pages/Dashboard'))
const HeroEditor = lazy(() => import('@/admin/pages/HeroEditor'))
const ServicesManager = lazy(() => import('@/admin/pages/ServicesManager'))
const ProjectsManager = lazy(() => import('@/admin/pages/ProjectsManager'))
const TeamManager = lazy(() => import('@/admin/pages/TeamManager'))
const TestimonialsManager = lazy(() => import('@/admin/pages/TestimonialsManager'))
const AboutEditor = lazy(() => import('@/admin/pages/AboutEditor'))
const SettingsEditor = lazy(() => import('@/admin/pages/SettingsEditor'))

// Auth
import { AuthProvider } from '@/admin/hooks/useAuth'
import ProtectedRoute from '@/admin/components/ProtectedRoute'

// Loading fallback
function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoading />}>
              <ProtectedRoute />
            </Suspense>
          }
        >
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="hero" element={<HeroEditor />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="team" element={<TeamManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="settings" element={<SettingsEditor />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}
