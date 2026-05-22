import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface CTABannerProps {
  /** Headline text */
  title: string
  /** Button label */
  buttonText: string
  /** Button destination route */
  buttonLink: string
  className?: string
}

export default function CTABanner({
  title,
  buttonText,
  buttonLink,
  className,
}: CTABannerProps) {
  return (
    <section className={cn('section-padding', className)}>
      <div className="container-bico">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center sm:px-12 lg:px-24 lg:py-24">
            {/* Decorative background shapes */}
            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/8 blur-xl" />
            <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-headline-md lg:text-headline-lg mx-auto max-w-3xl text-white mb-8">
                {title}
              </h2>

              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full bg-white px-8 py-6 text-base font-semibold text-primary shadow-lg transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:scale-105 active:scale-100"
              >
                <Link to={buttonLink}>
                  {buttonText}
                  <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
