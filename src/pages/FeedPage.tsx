import { useState } from 'react'
import { trpc } from '../lib/trpc'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Input } from '../components/ui/input'
import { Heart, MessageCircle, Send, Image, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'

export default function FeedPage() {
  const user = useAuthStore((s) => s.user)
  const [content, setContent] = useState('')
  const utils = trpc.useUtils()
  const feed = trpc.post.getFeed.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
  const createPost = trpc.post.create.useMutation({
    onSuccess: () => { setContent(''); utils.post.getFeed.invalidate(); toast.success('Post submitted for review!') },
    onError: (err) => toast.error(err.message),
  })
  const likePost = trpc.post.like.useMutation({
    onSuccess: () => utils.post.getFeed.invalidate(),
  })

  const handlePost = () => {
    if (!content.trim()) return
    createPost.mutate({ content })
  }

  const allPosts = feed.data?.pages.flatMap(p => p.items) || []

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{user?.fullName?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Input
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" type="button"><Image className="h-4 w-4" /></Button>
                </div>
                <Button size="sm" onClick={handlePost} disabled={!content.trim() || createPost.isPending}>
                  {createPost.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {feed.isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : allPosts.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No posts yet</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {allPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{post.author.fullName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{post.author.fullName}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <div className="px-6 pb-3 flex items-center gap-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className={`gap-1 ${post.isLiked ? 'text-red-500' : ''}`} onClick={() => likePost.mutate({ postId: post.id })}>
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likeCount}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageCircle className="h-4 w-4" /> {post.commentCount}
                </Button>
              </div>
            </Card>
          ))}
          {feed.hasNextPage && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => feed.fetchNextPage()} disabled={feed.isFetchingNextPage}>
                {feed.isFetchingNextPage ? 'Loading...' : 'Load more'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
