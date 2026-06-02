import { useState } from 'react'
import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Loader2, Plus, Building2, Ban, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function SuperAdminSchools() {
  const utils = trpc.useUtils()
  const { data: schools, isLoading } = trpc.superAdmin.getSchools.useQuery()
  const toggleStatus = trpc.superAdmin.toggleSchoolStatus.useMutation({
    onSuccess: () => { utils.superAdmin.getSchools.invalidate(); toast.success('School status updated!') },
    onError: (err) => toast.error(err.message),
  })
  const createSchool = trpc.superAdmin.createSchool.useMutation({
    onSuccess: () => { utils.superAdmin.getSchools.invalidate(); toast.success('School created!'); setOpen(false) },
    onError: (err) => toast.error(err.message),
  })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', code: '', city: '' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Schools</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Building2 className="h-4 w-4" /> Add School</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add School</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>School Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. ABC001" />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <Button onClick={() => createSchool.mutate(form)} className="w-full" disabled={createSchool.isPending}>
                {createSchool.isPending ? 'Creating...' : 'Add School'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schools?.map((school) => (
            <Card key={school.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{school.name}</h3>
                    <p className="text-sm text-muted-foreground">{school.code}</p>
                    {school.city && <p className="text-xs text-muted-foreground">{school.city}</p>}
                  </div>
                  <Badge variant={school.isActive ? 'default' : 'secondary'}>{school.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => toggleStatus.mutate({ schoolId: school.id, isActive: !school.isActive })}>
                  {school.isActive ? <Ban className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                  {school.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
