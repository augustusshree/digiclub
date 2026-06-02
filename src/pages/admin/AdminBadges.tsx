import { useState } from 'react'
import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Loader2, Plus, Award } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminBadges() {
  const utils = trpc.useUtils()
  const { data: badges, isLoading } = trpc.admin.getBadges.useQuery()
  const createBadge = trpc.admin.createBadge.useMutation({
    onSuccess: () => { utils.admin.getBadges.invalidate(); toast.success('Badge created!'); setOpen(false) },
    onError: (err) => toast.error(err.message),
  })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', icon: '🏆', category: 'ACHIEVEMENT' as const, pointsRequired: 0 })

  const handleCreate = () => {
    createBadge.mutate({
      name: form.name,
      description: form.description,
      icon: form.icon,
      category: form.category,
      pointsRequired: form.pointsRequired || undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Badges</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Badge</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Badge</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon (emoji)</Label>
                  <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
                    <option value="ACHIEVEMENT">Achievement</option>
                    <option value="MILESTONE">Milestone</option>
                    <option value="SPECIAL">Special</option>
                    <option value="SCHOOL">School</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Points Required (optional)</Label>
                <Input type="number" value={form.pointsRequired} onChange={(e) => setForm({ ...form, pointsRequired: parseInt(e.target.value) || 0 })} />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createBadge.isPending}>
                {createBadge.isPending ? 'Creating...' : 'Create Badge'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badges?.map((badge) => (
            <Card key={badge.id}>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h3 className="font-semibold">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
                <Badge variant="secondary" className="mt-2">{badge.category}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
