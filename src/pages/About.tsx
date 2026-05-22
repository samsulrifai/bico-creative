import { useEffect } from 'react'
import { Target, Eye, Link2, GitBranch, Share2, Globe } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import ScrollReveal from '@/components/shared/ScrollReveal'
import SectionHeading from '@/components/shared/SectionHeading'
import AnimatedCounter from '@/components/shared/AnimatedCounter'
import CTABanner from '@/components/shared/CTABanner'
import { useAbout, useTeam } from '@/hooks/useSupabase'
import { dummyAbout, dummyTeam } from '@/lib/dummy-data'
import { SITE_NAME } from '@/lib/constants'

/* ===== Social icon map ===== */
const socialIconMap: Record<string, React.ElementType> = {
  linkedin: Link2,
  github: GitBranch,
  instagram: Share2,
  dribbble: Globe,
  behance: Globe, // reuse for behance
}

/* ===== Avatar gradient palettes ===== */
const avatarGradients = [
  'linear-gradient(135deg, #0035c5 0%, #7197ff 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
]

/* ===== Parse stat numeric value ===== */
function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/)
  if (match) {
    return { num: parseInt(match[1], 10), suffix: match[2] }
  }
  return { num: 0, suffix: '' }
}

export default function About() {
  useEffect(() => {
    document.title = `About — ${SITE_NAME}`
  }, [])

  const { data: about } = useAbout()
  const { data: team } = useTeam()

  const abt = about ?? dummyAbout
  const tm = team ?? dummyTeam

  return (
    <>
      {/* ============================================ */}
      {/* HERO SECTION                                  */}
      {/* ============================================ */}
      <section className="section-padding pt-32 lg:pt-40">
        <div className="container-bico">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Text — 60% */}
            <div className="w-full lg:w-[60%]">
              <ScrollReveal>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                  Tentang Kami
                </span>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h1 className="text-headline-xl-mobile lg:text-headline-xl mb-6">
                  {abt.heading}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="text-body-lg text-muted-foreground leading-relaxed">
                  {abt.description}
                </p>
              </ScrollReveal>
            </div>

            {/* Placeholder image — 40% */}
            <ScrollReveal delay={300} className="w-full lg:w-[40%]">
              <div
                className="w-full aspect-[4/5] rounded-3xl shadow-lg"
                style={{
                  background: 'linear-gradient(160deg, #0035c5 0%, #7197ff 40%, #b9c3ff 70%, #e9edff 100%)',
                }}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VISION & MISSION                              */}
      {/* ============================================ */}
      <section className="section-padding">
        <div className="container-bico">
          <ScrollReveal>
            <SectionHeading
              chip="Fondasi Kami"
              title="Visi & Misi"
              centered
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {/* Vision */}
            <ScrollReveal delay={100}>
              <Card className="h-full border-border/50 hover:shadow-[0_8px_40px_rgba(0,53,197,0.10)] transition-shadow duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/40" />
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Eye className="size-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Visi</h3>
                  <p className="text-body-md text-muted-foreground leading-relaxed">
                    {abt.vision}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Mission */}
            <ScrollReveal delay={200}>
              <Card className="h-full border-border/50 hover:shadow-[0_8px_40px_rgba(0,53,197,0.10)] transition-shadow duration-300 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 to-primary" />
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="size-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Misi</h3>
                  <p className="text-body-md text-muted-foreground leading-relaxed">
                    {abt.mission}
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CORE VALUES                                   */}
      {/* ============================================ */}
      <section className="section-padding bg-muted/30">
        <div className="container-bico">
          <ScrollReveal>
            <SectionHeading
              chip="Nilai Inti"
              title="Yang Mendorong Kami"
              subtitle="Prinsip-prinsip yang membentuk setiap karya kami."
              centered
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {abt.core_values.map((value, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="relative bg-card rounded-2xl border border-border/50 p-8 hover:shadow-[0_8px_40px_rgba(0,53,197,0.10)] transition-all duration-300">
                  {/* Large background number */}
                  <span className="absolute top-4 right-6 text-8xl font-black text-primary/[0.07] select-none leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3 mt-8">{value.title}</h3>
                    <p className="text-body-md text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TEAM                                          */}
      {/* ============================================ */}
      <section className="section-padding">
        <div className="container-bico">
          <ScrollReveal>
            <SectionHeading
              chip="Tim Kami"
              title="Orang-Orang di Balik Bico"
              subtitle="Kenali tim kreatif yang berdedikasi untuk kesuksesan brand Anda."
              centered
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {tm.map((member, i) => {
              const initials = member.name
                .split(' ')
                .map((n) => n[0])
                .join('')

              return (
                <ScrollReveal key={member.id} delay={i * 100}>
                  <div className="group text-center">
                    {/* Avatar placeholder */}
                    <div className="relative mx-auto mb-6 w-36 h-36">
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-105"
                        style={{ background: avatarGradients[i % avatarGradients.length] }}
                      >
                        {initials}
                      </div>
                      {/* Social icons overlay on hover */}
                      <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {Object.entries(member.social_links).map(([platform, url]) => {
                          const SocialIcon = socialIconMap[platform] || Link2
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                            >
                              <SocialIcon className="size-4" />
                            </a>
                          )
                        })}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS                                         */}
      {/* ============================================ */}
      <section className="section-padding bg-primary text-white">
        <div className="container-bico">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {abt.stats.map((stat, i) => {
              const { num, suffix } = parseStatValue(stat.value)
              return (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="text-center">
                    <div className="text-5xl lg:text-6xl font-black mb-2">
                      <AnimatedCounter end={num} suffix={suffix} />
                    </div>
                    <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA BANNER                                    */}
      {/* ============================================ */}
      <CTABanner
        title="Mari Wujudkan Visi Brand Anda Bersama Kami"
        buttonText="Mulai Diskusi"
        buttonLink="/contact"
      />
    </>
  )
}
