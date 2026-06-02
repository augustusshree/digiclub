import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, protectedProcedure } from './trpc'
import { posts, likes, comments, users } from '../../db/schema'
import { eq, and, desc, count, sql, inArray } from 'drizzle-orm'

export const postRouter = router({
  create: protectedProcedure
    .input(z.object({
      content: z.string().min(1),
      mediaUrl: z.string().optional(),
      mediaType: z.enum(['TEXT', 'IMAGE', 'VIDEO', 'TASK']).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({ where: eq(users.id, ctx.userId) })
      const [post] = await ctx.db.insert(posts).values({
        content: input.content,
        mediaUrl: input.mediaUrl,
        mediaType: input.mediaType || 'TEXT',
        type: (input.mediaType as any) || 'TEXT',
        authorId: ctx.userId,
        schoolId: user?.schoolId,
        status: 'PENDING',
      }).$returningId()
      return post
    }),

  getFeed: protectedProcedure
    .input(z.object({ cursor: z.string().optional(), limit: z.number().int().positive().default(20) }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 20
      const offset = input?.cursor ? parseInt(input.cursor) : 0
      const allPosts = await ctx.db.query.posts.findMany({
        where: eq(posts.status, 'APPROVED'),
        orderBy: [desc(posts.createdAt)],
        limit: limit + 1,
        offset,
        with: {
          author: { columns: { id: true, fullName: true, profileImage: true, role: true } },
          school: { columns: { name: true } },
        },
      })
      const hasMore = allPosts.length > limit
      const items = hasMore ? allPosts.slice(0, limit) : allPosts
      const postIds = items.map(p => p.id)
      const likeCounts = postIds.length > 0
        ? await ctx.db.select({ postId: likes.postId, count: count() })
            .from(likes).where(inArray(likes.postId, postIds)).groupBy(likes.postId)
        : []
      const commentCounts = postIds.length > 0
        ? await ctx.db.select({ postId: comments.postId, count: count() })
            .from(comments).where(inArray(comments.postId, postIds)).groupBy(comments.postId)
        : []
      const userLikes = postIds.length > 0
        ? await ctx.db.select({ postId: likes.postId })
            .from(likes).where(and(inArray(likes.postId, postIds), eq(likes.authorId, ctx.userId)))
        : []
      const likedSet = new Set(userLikes.map(l => l.postId))
      const lcMap = new Map(likeCounts.map(l => [l.postId, Number(l.count)]))
      const ccMap = new Map(commentCounts.map(l => [l.postId, Number(l.count)]))
      return {
        items: items.map(p => ({
          ...p,
          likeCount: lcMap.get(p.id) || 0,
          commentCount: ccMap.get(p.id) || 0,
          isLiked: likedSet.has(p.id),
        })),
        nextCursor: hasMore ? String(offset + limit) : null,
      }
    }),

  getMyPosts: protectedProcedure
    .input(z.object({ status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const conditions = [eq(posts.authorId, ctx.userId)]
      if (input?.status) conditions.push(eq(posts.status, input.status))
      return ctx.db.query.posts.findMany({
        where: and(...conditions),
        orderBy: [desc(posts.createdAt)],
        with: { likes: true, comments: true },
      })
    }),

  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.likes.findFirst({
        where: and(eq(likes.postId, input.postId), eq(likes.authorId, ctx.userId)),
      })
      if (existing) {
        await ctx.db.delete(likes).where(eq(likes.id, existing.id))
        return { liked: false }
      }
      await ctx.db.insert(likes).values({ postId: input.postId, authorId: ctx.userId })
      return { liked: true }
    }),

  comment: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [c] = await ctx.db.insert(comments).values({
        postId: input.postId,
        authorId: ctx.userId,
        content: input.content,
      }).$returningId()
      return c
    }),

  getComments: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.comments.findMany({
        where: eq(comments.postId, input.postId),
        orderBy: [desc(comments.createdAt)],
        with: { author: { columns: { id: true, fullName: true, profileImage: true } } },
      })
    }),
})
