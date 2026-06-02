import { useState } from 'react'
import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Loader2, Plus, UserPlus, Ban, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SuperAdminAdmins() {
  const utils = trpc.useUtils()
  const { data: admins, isLoading } = trpc.superAdmin.getAdmins.useQuery()
  const { data: schools } = trpc.superAdmin.getSchools.useQuery()
  const toggleStatus = trpc.superAdmin.toggleAdminStatus.useMutation({
    onSuccess: () => { utils.superAdmin.getAdmins.invalidate(); toast.success('Admin status updated!') },
    onError: (err) => toast.error(err.message),
  })
  const createAdmin = trpc.superAdmin.createAdmin.useMutation({
    onSuccess: () => { utils.superAdmin.getAdmins.invalidate(); toast.success('Admin created!'); setOpen(false) },
    onError: (err) => toast.error(err.message),
  })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ email: '', fullName: '', schoolId: '', password: '' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><UserPlus className="h-4 w-4" /> Create Admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Admin Account</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>School</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.schoolId} onChange={(e) => setForm({ ...form, schoolId: e.target.value })}>
                  <option value="">Select school...</option>
                  {schools?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <Button onClick={() => createAdmin.mutate(form)} className="w-full" disabled={createAdmin.isPending}>
                {createAdmin.isPending ? 'Creating...' : 'Create Admin'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          {admins?.map((admin) => (
            <Card key={admin.id}>
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="font-medium">{admin.fullName}</p>
                  <p className="text-sm text-muted-foreground">{admin.email}</p>
                  <p className="text-xs text-muted-foreground">{admin.school?.name || 'No school'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={admin.isActive ? 'default' : 'secondary'}>{admin.isActive ? 'Active' : 'Inactive'}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => toggleStatus.mutate({ userId: admin.id, isActive: !admin.isActive })}>
                    {admin.isActive ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
