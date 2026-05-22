import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Stagger delay in ms before adding the visible class */
  delay?: number
  /** IntersectionObserver threshold (0–1), default 0.1 */
  threshold?: number
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      el.classList.add('visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const timeout = setTimeout(() => {
              el.classList.add('visible')
            }, delay)
            // Cleanup timeout if observer disconnects before delay
            const cleanup = () => clearTimeout(timeout)
            el.addEventListener('scroll-reveal-cleanup', cleanup, {
              once: true,
            })
          } else {
            el.classList.add('visible')
          }
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [delay, threshold])

  return (
    <div
      ref={ref}
      className={cn('scroll-reveal', className)}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
