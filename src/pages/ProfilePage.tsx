import { useParams } from 'react-router'
import { useAuthStore } from '../store/authStore'
import { trpc } from '../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Loader2, Trophy, Medal, Award } from 'lucide-react'

export default function ProfilePage() {
  const { id } = useParams()
  const currentUser = useAuthStore((s) => s.user)
  const userId = id || currentUser?.id || ''
  const { data: profile, isLoading } = trpc.user.getProfile.useQuery({ userId })

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
  if (!profile) return <div className="text-center py-12 text-muted-foreground">User not found</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarFallback className="text-2xl">{profile.fullName[0]}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
            <p className="text-muted-foreground">@{profile.username}</p>
            {profile.school && <p className="text-sm text-muted-foreground mt-1">{profile.school.name}</p>}
            {profile.bio && <p className="mt-2">{profile.bio}</p>}
            <div className="flex gap-4 mt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.points}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center">
                <Badge variant="secondary" className="text-sm px-3 py-1">{profile.rank}</Badge>
                <p className="text-xs text-muted-foreground mt-1">Rank</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{profile.posts?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {profile.userBadges && profile.userBadges.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" /> Badges</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.userBadges.map((ub) => (
                <Badge key={ub.id} variant="secondary" className="text-sm px-3 py-1">
                  {ub.badge.icon} {ub.badge.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
        <CardContent>
          {profile.posts?.length ? (
            <div className="space-y-3">
              {profile.posts.slice(0, 10).map((post) => (
                <div key={post.id} className="text-sm border-b pb-2 last:border-0">
                  <p>{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No posts yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
