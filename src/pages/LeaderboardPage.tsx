import { trpc } from '../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Loader2, Trophy, Medal, Award, Crown, Star, Sparkles, Target, Zap, Flame } from 'lucide-react'

const rankIcons: Record<string, React.ReactNode> = {
  NEWBIE: <Star className="h-4 w-4 text-gray-400" />,
  INITIATOR: <Zap className="h-4 w-4 text-blue-400" />,
  CREATOR: <Sparkles className="h-4 w-4 text-purple-400" />,
  KNIGHT: <Shield className="h-4 w-4 text-green-400" />,
  GUARDIAN: <Flame className="h-4 w-4 text-orange-400" />,
  APEX: <Crown className="h-4 w-4 text-yellow-400" />,
}

function Shield(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }

function getRankColor(rank: string) {
  const colors: Record<string, string> = {
    NEWBIE: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    INITIATOR: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    CREATOR: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    KNIGHT: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    GUARDIAN: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
    APEX: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
  }
  return colors[rank] || 'bg-gray-100 text-gray-600'
}

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = trpc.gamification.getLeaderboard.useQuery()

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-500" /> Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : (
            <div className="space-y-2">
              {leaderboard?.map((entry, idx) => (
                <div key={entry.id} className={`flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50 ${idx < 3 ? 'bg-muted/30' : ''}`}>
                  <div className="w-8 text-center font-bold text-lg">
                    {idx === 0 ? <Crown className="h-6 w-6 text-yellow-500 mx-auto" /> :
                     idx === 1 ? <Medal className="h-5 w-5 text-gray-400 mx-auto" /> :
                     idx === 2 ? <Medal className="h-5 w-5 text-amber-600 mx-auto" /> :
                     <span className="text-muted-foreground">#{idx + 1}</span>}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{entry.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{entry.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.schoolName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{entry.points}</p>
                    <Badge className={`text-xs ${getRankColor(entry.rank)}`} variant="secondary">
                      {entry.rank}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
