import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SERVICE_CATEGORIES } from '@/lib/constants'
import type { Project } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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
import { Plus, Pencil, Trash2, FolderOpen, Loader2, Star } from 'lucide-react'

type ProjectFormData = Omit<Project, 'id' | 'created_at' | 'updated_at'>

const emptyForm: ProjectFormData = {
  title: '',
  description: '',
  category: '',
  client_name: '',
  thumbnail_url: null,
  gallery_images: [],
  project_url: '',
  tech_stack: [],
  is_featured: false,
  sort_order: 0,
  is_active: true,
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm)
  const [techStackInput, setTechStackInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.title = 'Manage Projects — Bico Admin'
    
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (error) {
        toast.error(error.message)
      } else if (data) {
        setProjects(data)
      }
      setIsLoading(false)
    }

    fetchProjects()
  }, [])

  const categories = SERVICE_CATEGORIES.filter((c) => c !== 'All')

  const openAddDialog = () => {
    setEditingProject(null)
    setFormData({ ...emptyForm, sort_order: projects.length })
    setTechStackInput('')
    setDialogOpen(true)
  }

  const openEditDialog = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      client_name: project.client_name,
      thumbnail_url: project.thumbnail_url,
      gallery_images: project.gallery_images,
      project_url: project.project_url,
      tech_stack: project.tech_stack,
      is_featured: project.is_featured,
      sort_order: project.sort_order,
      is_active: project.is_active,
    })
    setTechStackInput(project.tech_stack.join(', '))
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

    const tech_stack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    if (editingProject) {
      const { error } = await supabase
        .from('projects')
        .update({ ...formData, tech_stack })
        .eq('id', editingProject.id)

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? { ...p, ...formData, tech_stack, updated_at: new Date().toISOString() }
            : p
        )
      )
      toast.success('Project berhasil diperbarui!')
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert([{ ...formData, tech_stack }])
        .select()
        .single()

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setProjects((prev) => [...prev, data])
      toast.success('Project baru berhasil ditambahkan!')
    }

    setDialogOpen(false)
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    const { error } = await supabase.from('projects').delete().eq('id', deletingId)
    
    if (error) {
      toast.error(error.message)
      return
    }
    
    setProjects((prev) => prev.filter((p) => p.id !== deletingId))
    setDeleteDialogOpen(false)
    setDeletingId(null)
    toast.success('Project berhasil dihapus.')
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_active: !currentStatus })
      .eq('id', id)
      
    if (error) {
      toast.error(error.message)
      return
    }
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manage Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola portfolio proyek Bico Creative
          </p>
        </div>
        <Button onClick={openAddDialog} className="rounded-full shadow-md">
          <Plus className="size-4" />
          Add Project
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
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden lg:table-cell text-center">Featured</TableHead>
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
              ) : projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    <FolderOpen className="mx-auto mb-2 size-10 opacity-30" />
                    <p>Belum ada project. Mulai tambahkan project pertama.</p>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project, index) => (
                  <TableRow key={project.id} className="group">
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{project.client_name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="text-xs">
                        {project.category || '—'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-center">
                      {project.is_featured ? (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
                          <Star className="mr-1 size-3 fill-amber-500" />
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={project.is_active}
                        onCheckedChange={() => toggleActive(project.id, project.is_active)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(project)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDeleteDialog(project.id)}
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
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            <DialogDescription>
              {editingProject
                ? 'Perbarui informasi project.'
                : 'Isi detail untuk menambahkan project baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="proj-title">Title *</Label>
              <Input
                id="proj-title"
                value={formData.title}
                onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. TechCorp Brand Refresh"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-desc">Description</Label>
              <Textarea
                id="proj-desc"
                value={formData.description || ''}
                onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                placeholder="Project description..."
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) => setFormData((f) => ({ ...f, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proj-client">Client Name</Label>
                <Input
                  id="proj-client"
                  value={formData.client_name || ''}
                  onChange={(e) => setFormData((f) => ({ ...f, client_name: e.target.value }))}
                  placeholder="e.g. TechCorp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-url">Project URL</Label>
              <Input
                id="proj-url"
                value={formData.project_url || ''}
                onChange={(e) => setFormData((f) => ({ ...f, project_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="proj-tech">Tech Stack (comma-separated)</Label>
              <Input
                id="proj-tech"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                placeholder="e.g. React, Next.js, Tailwind"
              />
              {techStackInput && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {techStackInput
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean)
                    .map((t, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
              <div>
                <Label className="text-sm font-medium">Featured Project</Label>
                <p className="text-xs text-muted-foreground">Tampilkan project ini di section utama</p>
              </div>
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData((f) => ({ ...f, is_featured: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              {editingProject ? 'Simpan Perubahan' : 'Tambah Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Project?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus project ini? Tindakan ini tidak dapat dibatalkan.
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
