import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Loader2, Users, School, Activity } from 'lucide-react'

export default function SuperAdminDashboard() {
  const { data: stats, isLoading } = trpc.superAdmin.getDashboard.useQuery()

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold mt-1">{stats?.totalUsers || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Schools</p>
                <p className="text-3xl font-bold mt-1">{stats?.totalSchools || 0}</p>
              </div>
              <School className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recent Activity</p>
                <p className="text-3xl font-bold mt-1">{stats?.recentActivity?.length || 0}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {stats?.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 10).map((log: any) => (
                <div key={log.id} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                  <div>
                    <span className="font-medium">{log.user?.fullName || 'System'}</span>
                    <span className="text-muted-foreground ml-1">{log.action} {log.entity}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
