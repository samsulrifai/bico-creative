import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { TeamMember } from '@/types/database'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
import { Plus, Pencil, Trash2, Users, Loader2 } from 'lucide-react'

type TeamFormData = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>

const emptyForm: TeamFormData = {
  name: '',
  role: '',
  bio: '',
  photo_url: null,
  social_links: {},
  sort_order: 0,
  is_active: true,
}

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TeamFormData>(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.title = 'Manage Team — Bico Admin'
    
    const fetchTeam = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) {
        toast.error(error.message)
      } else if (data) {
        setTeam(data)
      }
      setIsLoading(false)
    }

    fetchTeam()
  }, [])

  const openAddDialog = () => {
    setEditingMember(null)
    setFormData({ ...emptyForm, sort_order: team.length })
    setDialogOpen(true)
  }

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo_url: member.photo_url,
      social_links: { ...member.social_links },
      sort_order: member.sort_order,
      is_active: member.is_active,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!formData.role.trim()) {
      toast.error('Role is required')
      return
    }

    setIsSaving(true)

    if (editingMember) {
      const { error } = await supabase
        .from('team_members')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', editingMember.id)

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setTeam((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? { ...m, ...formData, updated_at: new Date().toISOString() }
            : m
        )
      )
      toast.success('Team member berhasil diperbarui!')
    } else {
      const newMember: TeamMember = {
        ...formData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('team_members').insert(newMember)

      if (error) {
        toast.error(error.message)
        setIsSaving(false)
        return
      }

      setTeam((prev) => [...prev, newMember])
      toast.success('Team member baru berhasil ditambahkan!')
    }

    setDialogOpen(false)
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    
    const { error } = await supabase.from('team_members').delete().eq('id', deletingId)
    
    if (error) {
      toast.error(error.message)
      return
    }

    setTeam((prev) => prev.filter((m) => m.id !== deletingId))
    setDeleteDialogOpen(false)
    setDeletingId(null)
    toast.success('Team member berhasil dihapus.')
  }

  const toggleActive = async (id: string) => {
    const member = team.find((m) => m.id === id)
    if (!member) return

    const { error } = await supabase
      .from('team_members')
      .update({ is_active: !member.is_active })
      .eq('id', id)

    if (error) {
      toast.error(error.message)
      return
    }

    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, is_active: !m.is_active } : m)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manage Team</h1>
          <p className="mt-1 text-muted-foreground">
            Kelola anggota tim Bico Creative
          </p>
        </div>
        <Button onClick={openAddDialog} className="rounded-full shadow-md">
          <Plus className="size-4" />
          Add Member
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Loader2 className="mx-auto mb-2 size-10 animate-spin opacity-30" />
                    <p>Memuat data team...</p>
                  </TableCell>
                </TableRow>
              ) : team.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    <Users className="mx-auto mb-2 size-10 opacity-30" />
                    <p>Belum ada team member. Mulai tambahkan anggota tim.</p>
                  </TableCell>
                </TableRow>
              ) : (
                team.map((member, index) => (
                  <TableRow key={member.id} className="group">
                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground md:hidden">{member.role}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{member.role}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={member.is_active}
                        onCheckedChange={() => toggleActive(member.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditDialog(member)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openDeleteDialog(member.id)}
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
            <DialogTitle>{editingMember ? 'Edit Team Member' : 'Add New Member'}</DialogTitle>
            <DialogDescription>
              {editingMember
                ? 'Perbarui informasi team member.'
                : 'Isi detail untuk menambahkan anggota baru.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="team-name">Name *</Label>
              <Input
                id="team-name"
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Andi Prasetyo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-role">Role *</Label>
              <Input
                id="team-role"
                value={formData.role}
                onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value }))}
                placeholder="e.g. Creative Director"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-bio">Bio</Label>
              <Textarea
                id="team-bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Short bio..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="rounded-full">
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              {editingMember ? 'Simpan Perubahan' : 'Tambah Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hapus Team Member?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus anggota tim ini? Tindakan ini tidak dapat dibatalkan.
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
