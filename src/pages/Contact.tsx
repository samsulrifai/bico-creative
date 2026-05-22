import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Share2,
  Link2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import ScrollReveal from '@/components/shared/ScrollReveal'
import { useServices, useSettings } from '@/hooks/useSupabase'
import { dummyServices, dummySettings } from '@/lib/dummy-data'
import { BUDGET_RANGES, WHATSAPP_NUMBER, SITE_NAME } from '@/lib/constants'



/* ===== Zod Schema ===== */
const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  service_interest: z.string().optional(),
  budget_range: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function Contact() {
  useEffect(() => {
    document.title = `Contact — ${SITE_NAME}`
  }, [])

  const { data: services } = useServices()
  const { data: settings } = useSettings()

  const svc = services ?? dummyServices
  const cfg = settings ?? dummySettings

  /* ===== Contact Info Items ===== */
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: cfg.contact_email,
      href: `mailto:${cfg.contact_email}`,
    },
    {
      icon: Phone,
      label: 'Telepon',
      value: cfg.contact_phone,
      href: `tel:${cfg.contact_phone?.replace(/\s/g, '')}`,
    },
    {
      icon: MapPin,
      label: 'Alamat',
      value: cfg.contact_address,
      href: undefined,
    },
    {
      icon: Clock,
      label: 'Jam Kerja',
      value: cfg.working_hours,
      href: undefined,
    },
  ]

  /* ===== Social Links ===== */
  const socialLinks = [
    {
      icon: Share2,
      label: 'Instagram',
      href: cfg.social_links?.instagram || '#',
    },
    {
      icon: Link2,
      label: 'LinkedIn',
      href: cfg.social_links?.linkedin || '#',
    },
  ]

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service_interest: '',
      budget_range: '',
      message: '',
    },
  })

  function onSubmit(data: ContactFormValues) {
    // Build WhatsApp pre-filled message
    const lines = [
      `Halo Bico Creative! 👋`,
      ``,
      `Nama: ${data.name}`,
      `Email: ${data.email}`,
    ]
    if (data.phone) lines.push(`Telepon: ${data.phone}`)
    if (data.service_interest) lines.push(`Layanan: ${data.service_interest}`)
    if (data.budget_range) lines.push(`Budget: ${data.budget_range}`)
    lines.push(``, `Pesan:`, data.message)

    const encodedMessage = encodeURIComponent(lines.join('\n'))
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`

    window.open(waUrl, '_blank')
  }

  return (
    <>
      {/* ============================================ */}
      {/* MAIN SECTION — Split layout                   */}
      {/* ============================================ */}
      <section className="section-padding pt-32 lg:pt-40 min-h-screen">
        <div className="container-bico">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* ====== FORM — 55% ====== */}
            <div className="w-full lg:w-[55%]">
              <ScrollReveal>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                  Hubungi Kami
                </span>
                <h1 className="text-headline-xl-mobile lg:text-headline-lg mb-4">
                  Mari Wujudkan <span className="text-primary">Ide Anda</span>
                </h1>
                <p className="text-body-md text-muted-foreground mb-10">
                  Isi formulir di bawah dan kami akan menghubungi Anda melalui WhatsApp untuk mendiskusikan proyek Anda lebih lanjut.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name & Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="h-12 rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email *</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@example.com"
                                className="h-12 rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon (opsional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+62 812 3456 7890"
                              className="h-12 rounded-xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Service Interest & Budget row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="service_interest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Layanan yang Diminati</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl w-full">
                                  <SelectValue placeholder="Pilih layanan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {svc.map((service) => (
                                  <SelectItem key={service.id} value={service.title}>
                                    {service.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="budget_range"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Range Budget</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 rounded-xl w-full">
                                  <SelectValue placeholder="Pilih budget" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {BUDGET_RANGES.map((range) => (
                                  <SelectItem key={range} value={range}>
                                    {range}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pesan *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Ceritakan tentang proyek Anda..."
                              rows={5}
                              className="rounded-xl resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="rounded-full px-10 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
                    >
                      <Send className="mr-2 size-4" />
                      Kirim via WhatsApp
                    </Button>
                  </form>
                </Form>
              </ScrollReveal>
            </div>

            {/* ====== CONTACT INFO — 45% ====== */}
            <div className="w-full lg:w-[45%]">
              <ScrollReveal delay={200}>
                <div className="bg-card rounded-3xl border border-border/50 p-8 lg:p-10 shadow-sm h-fit lg:sticky lg:top-32">
                  <h2 className="text-2xl font-bold mb-8">Informasi Kontak</h2>

                  <div className="space-y-6">
                    {contactInfo.map((item, i) => {
                      const Icon = item.icon
                      const content = (
                        <div className="flex items-start gap-4 group">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Icon className="size-5 text-primary group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground font-medium mb-0.5">
                              {item.label}
                            </p>
                            <p className="text-foreground font-semibold text-sm leading-relaxed">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      )

                      return item.href ? (
                        <a key={i} href={item.href} className="block hover:opacity-80 transition-opacity">
                          {content}
                        </a>
                      ) : (
                        <div key={i}>{content}</div>
                      )
                    })}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/50 my-8" />

                  {/* Social links */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      {socialLinks.map((social, i) => {
                        const SocialIcon = social.icon
                        return (
                          <a
                            key={i}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300"
                            aria-label={social.label}
                          >
                            <SocialIcon className="size-5" />
                          </a>
                        )
                      })}
                    </div>
                  </div>

                  {/* Decorative gradient block */}
                  <div
                    className="mt-8 w-full h-40 rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #0035c5 0%, #7197ff 40%, #b9c3ff 70%, #e9edff 100%)',
                    }}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
