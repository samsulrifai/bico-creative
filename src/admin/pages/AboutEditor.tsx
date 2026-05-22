import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { AboutContent, CoreValue, Stat } from '@/types/database'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Info,
  Target,
  Eye,
  Heart,
  BarChart3,
} from 'lucide-react'

export default function AboutEditor() {
  const [about, setAbout] = useState<AboutContent>({
    heading: '',
    description: '',
    mission: '',
    vision: '',
    core_values: [],
    stats: []
  } as unknown as AboutContent)
  const [recordId, setRecordId] = useState<string>('1')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'Edit About — Bico Admin'

    async function fetchAbout() {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .limit(1)
          .maybeSingle()

        if (error) throw error

        if (data) {
          setAbout({
            ...data,
            core_values: data.core_values || [],
            stats: data.stats || []
          })
          setRecordId(data.id)
        }
      } catch (error: any) {
        toast.error('Gagal mengambil data: ' + error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAbout()
  }, [])

  const handleChange = (field: keyof AboutContent, value: string) => {
    setAbout((prev) => ({ ...prev, [field]: value }))
  }

  // Core values handlers
  const addCoreValue = () => {
    setAbout((prev) => ({
      ...prev,
      core_values: [...prev.core_values, { title: '', description: '' }],
    }))
  }

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string) => {
    setAbout((prev) => ({
      ...prev,
      core_values: prev.core_values.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }))
  }

  const removeCoreValue = (index: number) => {
    setAbout((prev) => ({
      ...prev,
      core_values: prev.core_values.filter((_, i) => i !== index),
    }))
  }

  // Stats handlers
  const addStat = () => {
    setAbout((prev) => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '' }],
    }))
  }

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    setAbout((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }))
  }

  const removeStat = (index: number) => {
    setAbout((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert({ id: recordId, ...about, updated_at: new Date().toISOString() })
      
      if (error) throw error
      
      toast.success('About content berhasil disimpan!', {
        description: 'Perubahan akan terlihat di halaman About.',
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Edit About</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola konten halaman About Bico Creative
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="rounded-full shadow-md">
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Main content */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="size-5 text-primary" />
              <CardTitle className="text-lg">Informasi Utama</CardTitle>
            </div>
            <CardDescription>Heading dan deskripsi perusahaan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-heading">Heading</Label>
              <Input
                id="about-heading"
                value={about.heading || ''}
                onChange={(e) => handleChange('heading', e.target.value)}
                placeholder="e.g. We're Bico Creative"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about-desc">Description</Label>
              <Textarea
                id="about-desc"
                value={about.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Company description..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="size-5 text-primary" />
              <CardTitle className="text-lg">Mission & Vision</CardTitle>
            </div>
            <CardDescription>Misi dan visi perusahaan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="about-mission" className="flex items-center gap-1.5">
                <Target className="size-3.5 text-muted-foreground" />
                Mission
              </Label>
              <Textarea
                id="about-mission"
                value={about.mission || ''}
                onChange={(e) => handleChange('mission', e.target.value)}
                placeholder="Our mission..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="about-vision" className="flex items-center gap-1.5">
                <Eye className="size-3.5 text-muted-foreground" />
                Vision
              </Label>
              <Textarea
                id="about-vision"
                value={about.vision || ''}
                onChange={(e) => handleChange('vision', e.target.value)}
                placeholder="Our vision..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Core Values */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="size-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Core Values</CardTitle>
                <CardDescription>Nilai-nilai inti perusahaan</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={addCoreValue} className="rounded-full">
              <Plus className="size-4" />
              Add Value
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {about.core_values.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <Heart className="mx-auto mb-2 size-8 opacity-30" />
              <p className="text-sm">Belum ada core values. Klik "Add Value" untuk menambahkan.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {about.core_values.map((value, index) => (
                <div key={index} className="group relative rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeCoreValue(index)}
                      className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateCoreValue(index, 'title', e.target.value)}
                        placeholder="Value title"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={value.description}
                        onChange={(e) => updateCoreValue(index, 'description', e.target.value)}
                        placeholder="Value description"
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              <div>
                <CardTitle className="text-lg">Statistics</CardTitle>
                <CardDescription>Angka-angka pencapaian perusahaan</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={addStat} className="rounded-full">
              <Plus className="size-4" />
              Add Stat
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {about.stats.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <BarChart3 className="mx-auto mb-2 size-8 opacity-30" />
              <p className="text-sm">Belum ada statistics. Klik "Add Stat" untuk menambahkan.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {about.stats.map((stat, index) => (
                <div key={index} className="group relative rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeStat(index)}
                    className="absolute right-2 top-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Value</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        placeholder="e.g. 150+"
                        className="h-9 text-center font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                        placeholder="e.g. Projects"
                        className="h-9 text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
