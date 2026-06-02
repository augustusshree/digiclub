import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Loader2, Users, FileText, School, Swords } from 'lucide-react'

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.getDashboard.useQuery()

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
    </div>
  )
}
