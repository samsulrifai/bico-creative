import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Settings, Loader2 } from 'lucide-react'

const emptyService: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  short_description: '',
  full_description: '',
  icon: '',
  image_url: null,
  features: [],
  sort_order: 0,
  is_active: true,
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState(emptyService)
  const [featuresInput, setFeaturesInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.title = 'Manage Services — Bico Admin'

    const fetchServices = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        toast.error(error.message)
      } else if (data) {
        setServices(data)
      }
      setIsLoading(false)
    }

    fetchServices()
  }, [])

  const openAddDialog = () => {
    setEditingService(null)
    setFormData({ ...emptyService, sort_order: services.length })
    setFeaturesInput('')
    setDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setEditingService(service)
    setFormData({
      title: service.title,
      short_description: service.short_description,
      full_description: service.full_description,
      icon: service.icon,
      image_url: service.image_url,
      features: service.features,
      sort_order: service.sort_order,
      is_active: service.is_active,
    })
    setFeaturesInput(service.features.join(', '))
    setDialogOpen(true)
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsSaving(true)

    const features = featuresInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)

    if (editingService) {
      // Update existing
      const { error } = await supabase
        .from('services')
        .update({ ...formData, features, updated_at: new Date().toISOString() })
        .eq('id', editingService.id)

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setServices((prev) =>
        prev.map((s) =>
          s.id === editingService.id
            ? { ...s, ...formData, features, updated_at: new Date().toISOString() }
            : s
        )
      )
      toast.success('Service berhasil diperbarui!')
    } else {
      // Add new
      const newService: Service = {
        ...formData,
        features,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Service

      const { error } = await supabase.from('services').insert(newService)

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setServices((prev) => [...prev, newService])
      toast.success('Service baru berhasil ditambahkan!')
    }

    setDialogOpen(false)
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    
    const { error } = await supabase.from('services').delete().eq('id', deletingId)
    
    if (error) {
      toast.error(error.message)
      return
    }

    setServices((prev) => prev.filter((s) => s.id !== deletingId))
    setDeleteDialogOpen(false)
    setDeletingId(null)
    toast.success('Service berhasil dihapus.')
  }

  const toggleActive = async (id: string) => {
    const service = services.find((s) => s.id === id)
    if (!service) return

    const { error } = await supabase
      .from('services')
      .update({ is_active: !service.is_active })
      .eq('id', id)

    if (error) {
      toast.error(error.message)
      return
    }

    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manage Services</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola layanan yang ditawarkan Bico Creative
          </p>
        </div>
        <Button onClick={openAddDialog} className="rounded-full shadow-md">
          <Plus className="size-4" />
          Add Service
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Icon</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 size-10 animate-spin opacity-30" />
                    <p>Memuat data services...</p>
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Settings className="mx-auto mb-2 size-10 opacity-30" />
                    <p>Belum ada service. Mulai tambahkan service pertama.</p>
                  </TableCell>
                </TableRow>
              ) : (
                services.map((service, index) => (
                  <TableRow key={service.id} className="group">
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {service.short_description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="font-mono text-xs">
                        {service.icon || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={service.is_active}
                        onCheckedChange={() => toggleActive(service.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(service)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDeleteDialog(service.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {editingService
                ? 'Perbarui informasi service di bawah ini.'
                : 'Isi detail untuk menambahkan service baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="svc-title">Title *</Label>
              <Input
                id="svc-title"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Web Development"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svc-icon">Icon (Lucide name)</Label>
              <Input
                id="svc-icon"
                value={formData.icon || ''}
                onChange={(e) => setFormData((f) => ({ ...f, icon: e.target.value }))}
                placeholder="e.g. Code, Palette, TrendingUp"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svc-short-desc">Short Description</Label>
              <Textarea
                id="svc-short-desc"
                value={formData.short_description || ''}
                onChange={(e) => setFormData((f) => ({ ...f, short_description: e.target.value }))}
                placeholder="Brief description..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svc-full-desc">Full Description</Label>
              <Textarea
                id="svc-full-desc"
                value={formData.full_description || ''}
                onChange={(e) => setFormData((f) => ({ ...f, full_description: e.target.value }))}
                placeholder="Detailed description..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svc-features">Features (comma-separated)</Label>
              <Input
                id="svc-features"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                placeholder="e.g. Feature 1, Feature 2, Feature 3"
              />
              {featuresInput && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {featuresInput
                    .split(',')
                    .map((f) => f.trim())
                    .filter(Boolean)
                    .map((f, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {f}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              {editingService ? 'Simpan Perubahan' : 'Tambah Service'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Service?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus service ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
