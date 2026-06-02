import { trpc } from '../../lib/trpc'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Loader2, Check, X, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export default function AdminPosts() {
  const utils = trpc.useUtils()
  const { data: posts, isLoading } = trpc.admin.getPendingPosts.useQuery()
  const review = trpc.admin.reviewPost.useMutation({
    onSuccess: () => { utils.admin.getPendingPosts.invalidate(); toast.success('Post reviewed!') },
    onError: (err) => toast.error(err.message),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Posts</h1>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : !posts?.length ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No pending posts</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{post.author.fullName}</span>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  </div>
                  <Badge variant="outline">{post.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                {post.school && <p className="text-xs text-muted-foreground mt-2">{post.school.name}</p>}
              </CardContent>
              <div className="px-6 pb-4 flex gap-2">
                <Button size="sm" variant="default" className="gap-1" onClick={() => review.mutate({ postId: post.id, status: 'APPROVED', pointsAwarded: 10 })}>
                  <Check className="h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="destructive" className="gap-1" onClick={() => review.mutate({ postId: post.id, status: 'REJECTED' })}>
                  <X className="h-4 w-4" /> Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
