import { trpc } from '../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Loader2, Swords, Clock, Trophy } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export default function ChallengesPage() {
  const utils = trpc.useUtils()
  const { data: challenges, isLoading } = trpc.gamification.getChallenges.useQuery()
  const joinChallenge = trpc.gamification.joinChallenge.useMutation({
    onSuccess: () => { utils.gamification.getChallenges.invalidate(); toast.success('Joined challenge!') },
    onError: (err) => toast.error(err.message),
  })

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Swords className="h-6 w-6" /> Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : !challenges?.length ? (
            <p className="text-center text-muted-foreground py-8">No active challenges right now</p>
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => {
                const joined = challenge.participants?.length > 0
                return (
                  <Card key={challenge.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary">{challenge.type}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Trophy className="h-3 w-3" /> {challenge.pointsReward} pts
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(challenge.endDate), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={joined ? 'secondary' : 'default'}
                          disabled={joined || joinChallenge.isPending}
                          onClick={() => joinChallenge.mutate({ challengeId: challenge.id })}
                        >
                          {joined ? 'Joined' : 'Join'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
