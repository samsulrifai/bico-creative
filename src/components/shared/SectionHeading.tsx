import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface SectionHeadingProps {
  /** Small pill/chip text above the title */
  chip: string
  /** Main heading text */
  title: string
  /** Optional subtitle text below the heading */
  subtitle?: string
  /** Center-align the heading block (default: true) */
  centered?: boolean
  className?: string
}

export default function SectionHeading({
  chip,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={cn(
        'mb-12 lg:mb-16',
        centered && 'text-center',
        className
      )}
    >
      <Badge
        variant="secondary"
        className="mb-4 px-4 py-1.5 text-label-sm uppercase tracking-widest text-primary"
      >
        {chip}
      </Badge>

      <h2
        className={cn(
          'text-headline-md lg:text-headline-lg text-foreground',
          centered && 'mx-auto',
          subtitle ? 'mb-4' : 'mb-0'
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'text-body-lg text-muted-foreground max-w-2xl',
            centered && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  )
}
