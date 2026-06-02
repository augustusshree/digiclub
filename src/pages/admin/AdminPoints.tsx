import { useState } from 'react'
import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
import { Loader2, Search, Plus, Minus, Trophy, Clock, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

const RANK_COLORS: Record<string, string> = {
  NEWBIE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  INITIATOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  CREATOR: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  KNIGHT: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  GUARDIAN: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  APEX: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
}

export default function AdminPoints() {
  const utils = trpc.useUtils()
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [pointsAmount, setPointsAmount] = useState('')
  const [reason, setReason] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState<'award' | 'deduct'>('award')

  const { data: users, isLoading } = trpc.admin.getUsersForPoints.useQuery({ search: search || undefined })
  const { data: history } = trpc.admin.getPointsHistory.useQuery()
  const award = trpc.admin.awardPoints.useMutation({
    onSuccess: (data) => {
      utils.admin.getUsersForPoints.invalidate()
      utils.admin.getPointsOverview.invalidate()
      utils.admin.getPointsHistory.invalidate()
      toast.success(`Awarded ${pointsAmount} points! New total: ${data.newPoints}`)
      setDialogOpen(false)
      setPointsAmount('')
      setReason('')
    },
    onError: (err) => toast.error(err.message),
  })
  const deduct = trpc.admin.deductPoints.useMutation({
    onSuccess: (data) => {
      utils.admin.getUsersForPoints.invalidate()
      utils.admin.getPointsOverview.invalidate()
      utils.admin.getPointsHistory.invalidate()
      toast.success(`Deducted ${pointsAmount} points. New total: ${data.newPoints}`)
      setDialogOpen(false)
      setPointsAmount('')
      setReason('')
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = () => {
    if (!selectedUser || !pointsAmount || !reason) return toast.error('Fill all fields')
    const pts = Number(pointsAmount)
    if (pts < 1) return toast.error('Points must be at least 1')
    if (mode === 'award') award.mutate({ userId: selectedUser.id, points: pts, reason })
    else deduct.mutate({ userId: selectedUser.id, points: pts, reason })
  }

  const openDialog = (user: any, m: 'award' | 'deduct') => {
    setSelectedUser(user)
    setMode(m)
    setPointsAmount('')
    setReason('')
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Points Management</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search users by name, email, or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader><CardTitle>Users</CardTitle></CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : !users?.length ? (
            <div className="py-8 text-center text-muted-foreground">No users found</div>
          ) : (
            <div className="divide-y">
              {users.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between px-6 py-3 hover:bg-muted/50">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarFallback className="text-xs">
                        {user.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.school?.name || 'No school'} · {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold">{user.points.toLocaleString()} pts</p>
                      <Badge className={`text-xs ${RANK_COLORS[user.rank] || ''}`}>{user.rank}</Badge>
                    </div>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-green-500" onClick={() => openDialog(user, 'award')}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 text-red-500" onClick={() => openDialog(user, 'deduct')}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4" /> Points History</CardTitle></CardHeader>
        <CardContent className="p-0">
          {!history?.length ? (
            <div className="py-8 text-center text-muted-foreground">No points activity yet</div>
          ) : (
            <div className="divide-y">
              {history.map((log: any) => {
                const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details
                return (
                  <div key={log.id} className="px-6 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">
                        {(details?.points || 0) >= 0 ? '+' : ''}{details?.points || 0} pts
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {details?.reason && <p className="text-xs text-muted-foreground mt-1">{details.reason}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      New total: {details?.newTotal || 0} pts
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'award' ? 'Award Points' : 'Deduct Points'}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{selectedUser.fullName?.split(' ').map((n: string) => n[0]).join('') || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.fullName}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.points} pts · {selectedUser.rank}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input id="points" type="number" min={1} max={10000} value={pointsAmount} onChange={(e) => setPointsAmount(e.target.value)} placeholder="Enter amount" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Great contribution in weekly challenge" rows={3} />
              </div>
              <Button
                className="w-full"
                variant={mode === 'award' ? 'default' : 'destructive'}
                onClick={handleSubmit}
                disabled={award.isPending || deduct.isPending}
              >
                {(award.isPending || deduct.isPending) ? 'Processing...' : mode === 'award' ? `Award ${pointsAmount || 0} Points` : `Deduct ${pointsAmount || 0} Points`}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}