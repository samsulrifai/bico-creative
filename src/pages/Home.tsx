import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Palette, PenTool, Code, TrendingUp, Video, ArrowRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import CTABanner from '@/components/shared/CTABanner'
import { useHero, useServices, useProjects, useTestimonials } from '@/hooks/useSupabase'
import { dummyHero, dummyServices, dummyProjects, dummyTestimonials } from '@/lib/dummy-data'
import { SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

/* ===== Icon Map ===== */
const iconMap: Record<string, React.ElementType> = {
  Palette,
  Figma: PenTool,
  Code,
  TrendingUp,
  Video,
}

/* ===== Gradient palettes for project placeholders ===== */
const projectGradients = [
  'linear-gradient(135deg, #0035c5 0%, #7197ff 50%, #b9c3ff 100%)',
  'linear-gradient(135deg, #ff6b6b 0%, #ffa07a 50%, #ffd700 100%)',
  'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
]

/* ===== Client logo colors ===== */
const clientColors = [
  '#0035c5', '#ff6b6b', '#00c6fb', '#f5576c', '#43e97b', '#ffa07a',
]

export default function Home() {
  useEffect(() => {
    document.title = `${SITE_NAME} — We Craft Digital Experiences That Matter`
  }, [])

  const { data: hero } = useHero()
  const { data: services } = useServices()
  const { data: projects } = useProjects()
  const { data: testimonials } = useTestimonials()

  const h = hero ?? dummyHero
  const svc = services ?? dummyServices
  const proj = projects ?? dummyProjects
  const testi = testimonials ?? dummyTestimonials

  const featuredProjects = proj.filter((p) => p.is_featured)

  return (
    <>
      {/* ============================================ */}
      {/* HERO SECTION                                  */}
      {/* ============================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Decorative gradient blobs */}
        <div
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #0035c5 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-15 blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7197ff 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-[30%] right-[20%] w-[300px] h-[300px] rounded-full opacity-10 blur-[80px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #b9c3ff 0%, transparent 70%)' }}
        />

        <div className="container-bico text-center relative z-10">
          <ScrollReveal>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              ✨ Creative Digital Agency
            </Badge>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-headline-xl-mobile lg:text-headline-xl max-w-4xl mx-auto mb-6">
              {h.heading}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              {h.subheading}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow">
                <Link to={h.cta_primary_link || '/contact'}>
                  {h.cta_primary_text}
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
                <Link to={h.cta_secondary_link || '/projects'}>
                  {h.cta_secondary_text}
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================ */}
      {/* CLIENTS MARQUEE                               */}
      {/* ============================================ */}
      <section className="py-16 border-y border-border/50 bg-muted/30 overflow-hidden">
        <div className="container-bico mb-8">
          <p className="text-label-sm text-muted-foreground text-center uppercase tracking-widest">
            Dipercaya oleh brand-brand terbaik
          </p>
        </div>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee whitespace-nowrap">
            {[...h.client_logos, ...h.client_logos].map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="flex-shrink-0 mx-8 flex items-center justify-center rounded-xl px-8 py-4 h-16 min-w-[160px] font-bold text-white text-sm tracking-wide transition-transform hover:scale-105"
                style={{
                  backgroundColor: clientColors[i % clientColors.length],
                  opacity: 0.85,
                }}
              >
                {client.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SERVICES OVERVIEW                             */}
      {/* ============================================ */}
      <section className="section-padding">
        <div className="container-bico">
          <ScrollReveal>
            <SectionHeading
              chip="Layanan Kami"
              title="Solusi Kreatif untuk Setiap Kebutuhan"
              subtitle="Dari branding hingga development, kami siap membantu Anda."
              centered
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {svc.slice(0, 3).map((service, i) => {
              const Icon = iconMap[service.icon || 'Code'] || Code
              return (
                <ScrollReveal key={service.id} delay={i * 100}>
                  <div className="group relative bg-card rounded-2xl border border-border/50 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,53,197,0.12)] cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon className="size-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-headline-md text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-body-md text-muted-foreground leading-relaxed">
                      {service.short_description}
                    </p>
                    <div className="mt-6 flex items-center text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Selengkapnya <ArrowRight className="ml-1 size-4" />
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>

          <ScrollReveal delay={400}>
            <div className="text-center mt-12">
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link to="/services">
                  Lihat Semua Layanan
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================ */}
      {/* FEATURED PROJECTS                             */}
      {/* ============================================ */}
      <section className="section-padding bg-muted/30">
        <div className="container-bico">
          <ScrollReveal>
            <SectionHeading
              chip="Portfolio"
              title="Karya Terbaik Kami"
              subtitle="Lihat bagaimana kami membantu brand-brand terkemuka bertransformasi."
              centered
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {featuredProjects.map((project, i) => (
              <ScrollReveal
                key={project.id}
                delay={i * 100}
                className={cn(i % 2 === 1 && 'md:mt-12')}
              >
                <Link to="/projects" className="group block">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    {/* Gradient placeholder thumbnail */}
                    <div
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{ background: projectGradients[i % projectGradients.length] }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-8">
                      <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <Badge variant="secondary" className="mb-3">
                          {project.category}
                        </Badge>
                        <h3 className="text-white text-2xl font-bold">{project.title}</h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500}>
            <div className="text-center mt-12">
              <Button asChild className="rounded-full px-8">
                <Link to="/projects">
                  Lihat Semua Proyek
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================ */}
      {/* TESTIMONIALS                                  */}
      {/* ============================================ */}
      <section className="section-padding">
        <div className="container-bico">
          <ScrollReveal>
            <SectionHeading
              chip="Testimonial"
              title="Apa Kata Mereka"
              subtitle="Kepuasan klien adalah prioritas utama kami."
              centered
            />
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="max-w-3xl mx-auto mt-16">
              <Carousel
                opts={{ loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {testi.map((testimonial) => (
                    <CarouselItem key={testimonial.id}>
                      <div className="text-center px-4 md:px-12">
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
                          <Quote className="size-6 text-primary" />
                        </div>
                        <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-foreground">
                          &ldquo;{testimonial.quote}&rdquo;
                        </blockquote>
                        {/* Author avatar placeholder */}
                        <div className="flex items-center justify-center gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ background: 'linear-gradient(135deg, #0035c5, #7197ff)' }}
                          >
                            {testimonial.author_name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-foreground">{testimonial.author_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.author_role}, {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 md:-left-12" />
                <CarouselNext className="-right-4 md:-right-12" />
              </Carousel>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA BANNER                                    */}
      {/* ============================================ */}
      <CTABanner
        title="Siap Memulai Proyek Bersama Kami?"
        buttonText="Hubungi Kami"
        buttonLink="/contact"
      />
    </>
  )
}
