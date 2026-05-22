import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { Plus, Pencil, Trash2, MessageSquareQuote, Loader2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type TestimonialFormData = Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>

const emptyForm: TestimonialFormData = {
  quote: '',
  author_name: '',
  author_role: '',
  company: '',
  author_photo_url: null,
  rating: 5,
  sort_order: 0,
  is_active: true,
}

function StarRating({ rating }: { rating: number | null }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'size-3.5',
            star <= (rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  )
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TestimonialFormData>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.title = 'Manage Testimonials — Bico Admin'
    
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true })
        
      if (error) {
        toast.error(error.message)
      } else if (data) {
        setTestimonials(data)
      }
      setIsLoading(false)
    }

    fetchTestimonials()
  }, [])

  const openAddDialog = () => {
    setEditingTestimonial(null)
    setFormData({ ...emptyForm, sort_order: testimonials.length })
    setDialogOpen(true)
  }

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      quote: testimonial.quote,
      author_name: testimonial.author_name,
      author_role: testimonial.author_role,
      company: testimonial.company,
      author_photo_url: testimonial.author_photo_url,
      rating: testimonial.rating,
      sort_order: testimonial.sort_order,
      is_active: testimonial.is_active,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.quote.trim()) {
      toast.error('Quote is required')
      return
    }
    if (!formData.author_name.trim()) {
      toast.error('Author name is required')
      return
    }

    setIsSaving(true)

    if (editingTestimonial) {
      const { error } = await supabase
        .from('testimonials')
        .update(formData)
        .eq('id', editingTestimonial.id)

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === editingTestimonial.id
            ? { ...t, ...formData, updated_at: new Date().toISOString() }
            : t
        )
      )
      toast.success('Testimonial berhasil diperbarui!')
    } else {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([formData])
        .select()
        .single()

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setTestimonials((prev) => [...prev, data])
      toast.success('Testimonial baru berhasil ditambahkan!')
    }

    setDialogOpen(false)
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    const { error } = await supabase.from('testimonials').delete().eq('id', deletingId)
    
    if (error) {
      toast.error(error.message)
      return
    }
    
    setTestimonials((prev) => prev.filter((t) => t.id !== deletingId))
    setDeleteDialogOpen(false)
    setDeletingId(null)
    toast.success('Testimonial berhasil dihapus.')
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_active: !currentStatus })
      .eq('id', id)
      
    if (error) {
      toast.error(error.message)
      return
    }
    
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_active: !currentStatus } : t))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manage Testimonials</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola testimoni dari klien Bico Creative
          </p>
        </div>
        <Button onClick={openAddDialog} className="rounded-full shadow-md">
          <Plus className="size-4" />
          Add Testimonial
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="hidden md:table-cell">Company</TableHead>
                <TableHead className="hidden lg:table-cell">Rating</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    <MessageSquareQuote className="mx-auto mb-2 size-10 opacity-30" />
                    <p>Belum ada testimonial. Mulai tambahkan testimoni klien.</p>
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((testimonial, index) => (
                  <TableRow key={testimonial.id} className="group">
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{testimonial.author_name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          "{testimonial.quote.slice(0, 60)}..."
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{testimonial.company || '—'}</span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <StarRating rating={testimonial.rating} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={testimonial.is_active}
                        onCheckedChange={() => toggleActive(testimonial.id, testimonial.is_active)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(testimonial)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDeleteDialog(testimonial.id)}
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
            <DialogTitle>{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
            <DialogDescription>
              {editingTestimonial
                ? 'Perbarui informasi testimonial.'
                : 'Isi detail untuk menambahkan testimoni baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="testi-quote">Quote *</Label>
              <Textarea
                id="testi-quote"
                value={formData.quote}
                onChange={(e) => setFormData((f) => ({ ...f, quote: e.target.value }))}
                placeholder="What the client said..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="testi-name">Author Name *</Label>
                <Input
                  id="testi-name"
                  value={formData.author_name}
                  onChange={(e) => setFormData((f) => ({ ...f, author_name: e.target.value }))}
                  placeholder="e.g. Diana Kusuma"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="testi-role">Author Role</Label>
                <Input
                  id="testi-role"
                  value={formData.author_role || ''}
                  onChange={(e) => setFormData((f) => ({ ...f, author_role: e.target.value }))}
                  placeholder="e.g. CEO"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="testi-company">Company</Label>
                <Input
                  id="testi-company"
                  value={formData.company || ''}
                  onChange={(e) => setFormData((f) => ({ ...f, company: e.target.value }))}
                  placeholder="e.g. TechCorp Indonesia"
                />
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <Select
                  value={String(formData.rating || 5)}
                  onValueChange={(value) => setFormData((f) => ({ ...f, rating: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: r }).map((_, i) => (
                              <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span>({r})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              {editingTestimonial ? 'Simpan Perubahan' : 'Tambah Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Testimonial?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus testimonial ini? Tindakan ini tidak dapat dibatalkan.
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
