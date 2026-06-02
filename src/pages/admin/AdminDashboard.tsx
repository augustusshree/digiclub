import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Loader2, Users, FileText, School, Swords, Trophy, Award, TrendingUp } from 'lucide-react'

const RANK_COLORS: Record<string, string> = {
  NEWBIE: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  INITIATOR: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  CREATOR: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  KNIGHT: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  GUARDIAN: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  APEX: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.getDashboard.useQuery()
  const { data: points } = trpc.admin.getPointsOverview.useQuery()

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>

  const cards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
    { title: 'Total Posts', value: stats?.totalPosts || 0, icon: FileText, color: 'text-green-500' },
    { title: 'Schools', value: stats?.totalSchools || 0, icon: School, color: 'text-purple-500' },
    { title: 'Challenges', value: stats?.totalChallenges || 0, icon: Swords, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" /> Total Points</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{points?.totalPoints?.toLocaleString() || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" /> Avg Points / User</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold">{points?.avgPoints || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Award className="h-4 w-4 text-purple-500" /> Top Rank</CardTitle></CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{points?.topUsers?.[0]?.rank || '—'}</p>
            <p className="text-xs text-muted-foreground">{points?.topUsers?.[0]?.fullName || '—'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats?.postsByStatus && stats.postsByStatus.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Posts by Status</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.postsByStatus.map((item: any) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{item.status?.toLowerCase()}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {points?.rankDistribution && points.rankDistribution.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Users by Rank</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {points.rankDistribution.map((r: any) => (
                  <div key={r.rank} className="flex items-center justify-between">
                    <Badge className={RANK_COLORS[r.rank] || ''}>{r.rank}</Badge>
                    <span className="font-bold">{r.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
