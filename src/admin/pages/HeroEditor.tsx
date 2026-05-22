import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { HeroContent } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Save, Sparkles, Loader2, Link as LinkIcon, Type } from 'lucide-react'

export default function HeroEditor() {
  const [hero, setHero] = useState<HeroContent>({ heading: '' } as HeroContent)
  const [recordId, setRecordId] = useState<string>('1')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'Edit Hero — Bico Admin'
    
    async function fetchHero() {
      try {
        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .limit(1)
          .maybeSingle()

        if (error) throw error
        
        if (data) {
          setHero(data)
          setRecordId(data.id)
        }
      } catch (error: any) {
        toast.error('Gagal mengambil data: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchHero()
  }, [])

  const handleChange = (field: keyof HeroContent, value: string) => {
    setHero((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('hero_content')
        .upsert({ id: recordId, ...hero, updated_at: new Date().toISOString() })
      
      if (error) throw error
      
      toast.success('Hero content berhasil disimpan!', {
        description: 'Perubahan akan terlihat di halaman utama.',
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

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Edit Hero</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola konten hero section di halaman utama
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="rounded-full shadow-md">
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Main content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Type className="size-5 text-primary" />
              <CardTitle className="text-lg">Konten Utama</CardTitle>
            </div>
            <CardDescription>Heading dan subheading yang ditampilkan di hero section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="heading">Heading</Label>
              <Input
                id="heading"
                value={hero.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="Enter hero heading..."
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">{(hero.heading || '').length}/80 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading</Label>
              <Textarea
                id="subheading"
                value={hero.subheading || ''}
                onChange={(e) => handleChange('subheading', e.target.value)}
                placeholder="Enter hero subheading..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">{(hero.subheading || '').length}/200 characters</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LinkIcon className="size-5 text-primary" />
              <CardTitle className="text-lg">Call to Action</CardTitle>
            </div>
            <CardDescription>Tombol CTA primary dan secondary di hero section</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span className="text-sm font-semibold">Primary CTA</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta_primary_text">Button Text</Label>
                  <Input
                    id="cta_primary_text"
                    value={hero.cta_primary_text || ''}
                    onChange={(e) => handleChange('cta_primary_text', e.target.value)}
                    placeholder="e.g. Mulai Proyek"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_primary_link">Button Link</Label>
                  <Input
                    id="cta_primary_link"
                    value={hero.cta_primary_link || ''}
                    onChange={(e) => handleChange('cta_primary_link', e.target.value)}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="size-4 rounded-full border-2 border-muted-foreground" />
                <span className="text-sm font-semibold">Secondary CTA</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cta_secondary_text">Button Text</Label>
                  <Input
                    id="cta_secondary_text"
                    value={hero.cta_secondary_text || ''}
                    onChange={(e) => handleChange('cta_secondary_text', e.target.value)}
                    placeholder="e.g. Lihat Portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_secondary_link">Button Link</Label>
                  <Input
                    id="cta_secondary_link"
                    value={hero.cta_secondary_link || ''}
                    onChange={(e) => handleChange('cta_secondary_link', e.target.value)}
                    placeholder="/projects"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>Tampilan hero section berdasarkan konten di atas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-gradient-to-br from-primary/5 via-background to-primary/10 p-8 text-center md:p-12">
            <h2 className="text-headline-md text-foreground mb-4">
              {hero.heading || 'Your heading here...'}
            </h2>
            <p className="mx-auto max-w-2xl text-body-md text-muted-foreground mb-6">
              {hero.subheading || 'Your subheading here...'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {hero.cta_primary_text && (
                <span className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md">
                  {hero.cta_primary_text}
                </span>
              )}
              {hero.cta_secondary_text && (
                <span className="inline-flex h-11 items-center rounded-full border-2 border-primary/30 px-6 text-sm font-semibold text-primary">
                  {hero.cta_secondary_text}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
