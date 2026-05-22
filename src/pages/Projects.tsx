import { useEffect, useState, useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import CTABanner from '@/components/shared/CTABanner'
import { useProjects } from '@/hooks/useSupabase'
import { dummyProjects } from '@/lib/dummy-data'
import { SERVICE_CATEGORIES, SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { Project } from '@/types/database'

/* ===== Gradient palettes for project placeholders ===== */
const projectGradients = [
  'linear-gradient(135deg, #0035c5 0%, #7197ff 50%, #b9c3ff 100%)',
  'linear-gradient(135deg, #ff6b6b 0%, #ffa07a 50%, #ffd700 100%)',
  'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
]

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    document.title = `Projects — ${SITE_NAME}`
  }, [])

  const { data: projects } = useProjects()
  const proj = projects ?? dummyProjects

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return proj
    return proj.filter((p) => p.category === activeFilter)
  }, [activeFilter, proj])

  return (
    <>
      {/* ============================================ */}
      {/* HERO SECTION                                  */}
      {/* ============================================ */}
      <section className="section-padding pt-32 lg:pt-40">
        <div className="container-bico">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
                Portfolio
              </Badge>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className="text-headline-xl-mobile lg:text-headline-xl mb-6">
                Karya <span className="text-primary">Terbaik</span> Kami
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-body-lg text-muted-foreground">
                Setiap proyek adalah cerita kolaborasi. Jelajahi portfolio kami dan lihat bagaimana kami membantu brand-brand terkemuka bertransformasi di dunia digital.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FILTER BAR                                    */}
      {/* ============================================ */}
      <section className="pb-4">
        <div className="container-bico">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {SERVICE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={cn(
                    'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border',
                    activeFilter === category
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25'
                      : 'bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROJECT GRID                                  */}
      {/* ============================================ */}
      <section className="section-padding pt-8">
        <div className="container-bico">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, i) => (
              <div
                key={project.id}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <ScrollReveal delay={i * 80}>
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    {/* Gradient placeholder thumbnail */}
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{
                        background:
                          projectGradients[
                            parseInt(project.id) % projectGradients.length
                          ],
                      }}
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-8">
                      <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75 text-center">
                        <h3 className="text-white text-2xl font-bold mb-3">{project.title}</h3>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                          <Badge variant="secondary" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                        <span className="text-white/80 text-sm font-medium inline-flex items-center gap-1">
                          View Details
                          <ExternalLink className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                Belum ada proyek dalam kategori ini.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* DETAIL MODAL                                  */}
      {/* ============================================ */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              {/* Large placeholder image */}
              <div
                className="w-full aspect-video rounded-xl mb-2"
                style={{
                  background:
                    projectGradients[
                      parseInt(selectedProject.id) % projectGradients.length
                    ],
                }}
              />

              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {selectedProject.client_name && (
                    <span className="font-medium text-foreground">
                      Client: {selectedProject.client_name}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Category */}
                <div>
                  <Badge variant="secondary">{selectedProject.category}</Badge>
                </div>

                {/* Description */}
                <p className="text-body-md text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>

                {/* Tech stack */}
                {selectedProject.tech_stack.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech_stack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project URL */}
                {selectedProject.project_url && (
                  <a
                    href={selectedProject.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
                  >
                    Kunjungi Website
                    <ExternalLink className="size-4" />
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* CTA BANNER                                    */}
      {/* ============================================ */}
      <CTABanner
        title="Punya Proyek Serupa? Mari Diskusikan"
        buttonText="Mulai Proyek"
        buttonLink="/contact"
      />
    </>
  )
}
