import { useEffect } from 'react'
import {
  Palette,
  PenTool as FigmaIcon,
  Code,
  TrendingUp,
  Video,
  Search,
  Lightbulb,
  PenTool,
  Rocket,
  CheckCircle,
  Monitor,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import CTABanner from '@/components/shared/CTABanner'
import { useServices } from '@/hooks/useSupabase'
import { dummyServices } from '@/lib/dummy-data'
import { SITE_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

/* ===== Icon Map ===== */
const iconMap: Record<string, React.ElementType> = {
  Palette,
  Figma: FigmaIcon,
  Code,
  TrendingUp,
  Video,
}

/* ===== Service placeholder gradients ===== */
const serviceGradients = [
  'linear-gradient(135deg, #0035c5 0%, #7197ff 50%, #e9edff 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #ffd700 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #667eea 100%)',
]

/* ===== Process Steps ===== */
const processSteps = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Kami mendalami bisnis, audiens, dan tujuan Anda melalui riset mendalam.',
  },
  {
    icon: Lightbulb,
    title: 'Strategy',
    description: 'Menyusun strategi kreatif yang terukur dan selaras dengan goals bisnis Anda.',
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Menerjemahkan strategi menjadi desain visual yang stunning dan fungsional.',
  },
  {
    icon: Monitor,
    title: 'Develop',
    description: 'Membangun produk digital dengan teknologi modern dan best practices.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Peluncuran yang terkoordinasi dengan monitoring dan optimisasi berkelanjutan.',
  },
]

export default function Services() {
  useEffect(() => {
    document.title = `Services — ${SITE_NAME}`
  }, [])

  const { data: services } = useServices()
  const svc = services ?? dummyServices

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
                Layanan Kami
              </Badge>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h1 className="text-headline-xl-mobile lg:text-headline-xl mb-6">
                Layanan Kreatif <span className="text-primary">End-to-End</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-body-lg text-muted-foreground">
                Kami menyediakan solusi kreatif digital yang komprehensif. Dari strategi brand hingga development, setiap layanan dirancang untuk memberikan dampak nyata.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SERVICE DETAILS — ALTERNATING ROWS            */}
      {/* ============================================ */}
      <section className="section-padding pt-0">
        <div className="container-bico space-y-24 lg:space-y-32">
          {svc.map((service, i) => {
            const Icon = iconMap[service.icon || 'Code'] || Code
            const isReversed = i % 2 === 1

            return (
              <div
                key={service.id}
                className={cn(
                  'flex flex-col gap-12 lg:gap-16 items-center',
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                )}
              >
                {/* Placeholder gradient image */}
                <ScrollReveal
                  delay={100}
                  className="w-full lg:w-1/2"
                >
                  <div
                    className="w-full aspect-[4/3] rounded-3xl shadow-lg"
                    style={{
                      background: serviceGradients[i % serviceGradients.length],
                    }}
                  />
                </ScrollReveal>

                {/* Text content */}
                <ScrollReveal delay={200} className="w-full lg:w-1/2">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <h2 className="text-headline-md mb-4">{service.title}</h2>
                    <p className="text-body-md text-muted-foreground leading-relaxed mb-8">
                      {service.full_description}
                    </p>
                    {/* Feature bullet list */}
                    <ul className="space-y-3">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="size-4 text-primary" />
                          </div>
                          <span className="text-body-md font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              </div>
            )
          })}
        </div>
      </section>

      {/* ============================================ */}
      {/* PROCESS TIMELINE                              */}
      {/* ============================================ */}
      <section className="section-padding bg-muted/30">
        <div className="container-bico">
          <ScrollReveal>
            <SectionHeading
              chip="Proses Kerja"
              title="Cara Kami Bekerja"
              subtitle="Proses terstruktur yang memastikan hasil optimal untuk setiap proyek."
              centered
            />
          </ScrollReveal>

          {/* Desktop: Horizontal timeline */}
          <div className="hidden lg:block mt-20">
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-border" />

              <div className="grid grid-cols-5 gap-4">
                {processSteps.map((step, i) => {
                  const StepIcon = step.icon
                  return (
                    <ScrollReveal key={i} delay={i * 150}>
                      <div className="flex flex-col items-center text-center relative">
                        {/* Circle node */}
                        <div className="w-24 h-24 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-6 shadow-lg relative z-10 group hover:bg-primary transition-colors duration-300">
                          <StepIcon className="size-8 text-primary group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed px-2">
                          {step.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical timeline */}
          <div className="lg:hidden mt-16">
            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-border" />

              <div className="space-y-12">
                {processSteps.map((step, i) => {
                  const StepIcon = step.icon
                  return (
                    <ScrollReveal key={i} delay={i * 100}>
                      <div className="flex gap-6">
                        {/* Circle node */}
                        <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-md relative z-10 flex-shrink-0">
                          <StepIcon className="size-6 text-primary" />
                        </div>
                        <div className="pt-2">
                          <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA BANNER                                    */}
      {/* ============================================ */}
      <CTABanner
        title="Tertarik dengan Layanan Kami?"
        buttonText="Konsultasi Gratis"
        buttonLink="/contact"
      />
    </>
  )
}
