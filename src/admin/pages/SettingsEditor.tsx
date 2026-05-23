import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { SiteSettings } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Cog,
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  ImageIcon,
} from 'lucide-react'

const SOCIAL_PLATFORMS = [
  'instagram',
  'linkedin',
  'behance',
  'dribbble',
  'twitter',
  'facebook',
  'github',
  'youtube',
  'tiktok',
] as const

export default function SettingsEditor() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    working_hours: '',
    social_links: {}
  } as SiteSettings)
  const [recordId, setRecordId] = useState<string>('1')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Social links as array of tuples for easy editing
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([])

  useEffect(() => {
    document.title = 'Site Settings — Bico Admin'

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .limit(1)
          .maybeSingle()

        if (error) throw error

        if (data) {
          setSettings({
            ...data,
            social_links: data.social_links || {}
          })
          setRecordId(data.id)
          setSocialLinks(Object.entries(data.social_links || {}).map(([platform, url]) => ({ platform, url: url as string })))
        }
      } catch (error: any) {
        toast.error('Gagal mengambil data: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  // Social link handlers
  const addSocialLink = () => {
    setSocialLinks((prev) => [...prev, { platform: '', url: '' }])
  }

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setSocialLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
    )
  }

  const removeSocialLink = (index: number) => {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setIsSaving(true)

    // Build social_links object from array
    const social_links: Record<string, string> = {}
    socialLinks
      .filter((l) => l.platform && l.url)
      .forEach((l) => { social_links[l.platform] = l.url })

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ ...settings, id: recordId, social_links, updated_at: new Date().toISOString() })
      
      if (error) throw error

      setSettings((prev) => ({ ...prev, social_links }))
      toast.success('Settings berhasil disimpan!', {
        description: 'Perubahan akan diterapkan di seluruh website.',
      })
    } catch (error: any) {
      toast.error('Gagal menyimpan: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Filter used platforms for each dropdown
  const usedPlatforms = socialLinks.map((l) => l.platform).filter(Boolean)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Site Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Konfigurasi pengaturan umum website
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="rounded-full shadow-md">
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* General */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cog className="size-5 text-primary" />
              <CardTitle className="text-lg">General</CardTitle>
            </div>
            <CardDescription>Pengaturan dasar website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name" className="flex items-center gap-1.5">
                <Globe className="size-3.5 text-muted-foreground" />
                Site Name
              </Label>
              <Input
                id="site-name"
                value={settings.site_name}
                onChange={(e) => handleChange('site_name', e.target.value)}
                placeholder="e.g. Bico Creative"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo-url" className="flex items-center gap-1.5">
                <ImageIcon className="size-3.5 text-muted-foreground" />
                Logo URL
              </Label>
              <Input
                id="logo-url"
                value={settings.logo_url || ''}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="working-hours" className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-muted-foreground" />
                Working Hours
              </Label>
              <Input
                id="working-hours"
                value={settings.working_hours || ''}
                onChange={(e) => handleChange('working_hours', e.target.value)}
                placeholder="e.g. Mon - Fri: 09:00 - 18:00 WIB"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-primary" />
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </div>
            <CardDescription>Informasi kontak yang ditampilkan di website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="flex items-center gap-1.5">
                <Mail className="size-3.5 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                placeholder="hello@bicocreative.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-muted-foreground" />
                Phone
              </Label>
              <Input
                id="contact-phone"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="+62 812 3456 7890"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-address" className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground" />
                Address
              </Label>
              <Textarea
                id="contact-address"
                value={settings.contact_address || ''}
                onChange={(e) => handleChange('contact_address', e.target.value)}
                placeholder="Full address..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="size-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Social Links</CardTitle>
                <CardDescription>Link social media yang ditampilkan di website</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={addSocialLink} className="rounded-full">
              <Plus className="size-4" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {socialLinks.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <Globe className="mx-auto mb-2 size-8 opacity-30" />
              <p className="text-sm">Belum ada social links. Klik "Add Link" untuk menambahkan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link, index) => (
                <div key={index} className="group flex items-start gap-3 rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40">
                  <div className="w-40 shrink-0">
                    <Select
                      value={link.platform}
                      onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                    >
                      <SelectTrigger className="h-9 capitalize">
                        <SelectValue placeholder="Platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIAL_PLATFORMS.map((p) => (
                          <SelectItem
                            key={p}
                            value={p}
                            disabled={usedPlatforms.includes(p) && link.platform !== p}
                            className="capitalize"
                          >
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Input
                      value={link.url}
                      onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="h-9"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeSocialLink(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
