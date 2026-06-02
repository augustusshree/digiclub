import { useState } from 'react'
import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Loader2, Plus, Swords, Clock, Trophy } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminChallenges() {
  const utils = trpc.useUtils()
  const { data: challenges, isLoading } = trpc.admin.getChallenges.useQuery()
  const createChallenge = trpc.admin.createChallenge.useMutation({
    onSuccess: () => { utils.admin.getChallenges.invalidate(); toast.success('Challenge created!'); setOpen(false) },
    onError: (err) => toast.error(err.message),
  })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', type: 'WEEKLY' as const, pointsReward: 50, startDate: '', endDate: '', criteria: '' })

  const handleCreate = () => {
    createChallenge.mutate({
      title: form.title,
      description: form.description,
      type: form.type,
      pointsReward: form.pointsReward,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
      criteria: form.criteria || undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> New Challenge</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Challenge</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="SPECIAL">Special</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Points Reward</Label>
                  <Input type="number" value={form.pointsReward} onChange={(e) => setForm({ ...form, pointsReward: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={createChallenge.isPending}>
                {createChallenge.isPending ? 'Creating...' : 'Create Challenge'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {challenges?.map((challenge) => (
            <Card key={challenge.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant={challenge.status === 'ACTIVE' ? 'default' : 'secondary'}>{challenge.status}</Badge>
                      <Badge variant="outline">{challenge.type}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Trophy className="h-3 w-3" /> {challenge.pointsReward} pts
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {challenge.participants?.length || 0} participants
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
