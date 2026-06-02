import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, adminProcedure } from './trpc'
import { posts, users, challenges, challengeParticipants, badges, activityLogs, schools } from '../../db/schema'
import { eq, and, desc, count, sql } from 'drizzle-orm'

export const adminRouter = router({
  getDashboard: adminProcedure.query(async ({ ctx }) => {
    const totalUsers = await ctx.db.select({ count: count() }).from(users)
    const totalPosts = await ctx.db.select({ count: count() }).from(posts)
    const totalSchools = await ctx.db.select({ count: count() }).from(schools)
    const totalChallenges = await ctx.db.select({ count: count() }).from(challenges)
    const postsByStatus = await ctx.db.select({ status: posts.status, count: count() })
      .from(posts).groupBy(posts.status)
    const usersByRole = await ctx.db.select({ role: users.role, count: count() })
      .from(users).groupBy(users.role)
    const recentActivity = await ctx.db.query.activityLogs.findMany({
      orderBy: [desc(activityLogs.createdAt)],
      limit: 10,
    })
    if (ctx.userRole !== 'SUPER_ADMIN') {
      const schoolFilter = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.userId),
        columns: { schoolId: true },
      })
    }
    return {
      totalUsers: Number(totalUsers[0]?.count || 0),
      totalPosts: Number(totalPosts[0]?.count || 0),
      totalSchools: Number(totalSchools[0]?.count || 0),
      totalChallenges: Number(totalChallenges[0]?.count || 0),
      postsByStatus,
      usersByRole,
      topSchools: [],
      recentActivity,
    }
  }),

  getPendingPosts: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.posts.findMany({
      where: eq(posts.status, 'PENDING'),
      orderBy: [desc(posts.createdAt)],
      with: {
        author: { columns: { id: true, fullName: true, profileImage: true } },
        school: { columns: { name: true } },
      },
    })
  }),

  reviewPost: adminProcedure
    .input(z.object({ postId: z.string(), status: z.enum(['APPROVED', 'REJECTED']), pointsAwarded: z.number().int().positive().optional() }))
    .mutation(async ({ ctx, input }) => {
      const updateData: any = { status: input.status, reviewedById: ctx.userId, updatedAt: new Date() }
      if (input.status === 'APPROVED') updateData.pointsAwarded = input.pointsAwarded || 10
      await ctx.db.update(posts).set(updateData).where(eq(posts.id, input.postId))
      if (input.status === 'APPROVED' && updateData.pointsAwarded) {
        const post = await ctx.db.query.posts.findFirst({ where: eq(posts.id, input.postId) })
        if (post) {
          const user = await ctx.db.query.users.findFirst({ where: eq(users.id, post.authorId) })
          if (user) {
            const newPoints = user.points + updateData.pointsAwarded
            const { calculateRank } = await import('../../contracts/index')
            const newRank = calculateRank(newPoints)
            await ctx.db.update(users).set({ points: newPoints, rank: newRank, updatedAt: new Date() })
              .where(eq(users.id, post.authorId))
          }
        }
      }
      return { success: true }
    }),

  createChallenge: adminProcedure
    .input(z.object({
      title: z.string().min(1), description: z.string().min(1),
      type: z.enum(['WEEKLY', 'MONTHLY', 'SPECIAL']),
      pointsReward: z.number().int().positive(),
      badgeRewardId: z.string().optional(),
      startDate: z.coerce.date(), endDate: z.coerce.date(),
      criteria: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [c] = await ctx.db.insert(challenges).values({
        ...input, status: 'ACTIVE', createdById: ctx.userId,
      }).$returningId()
      return c
    }),

  getChallenges: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.challenges.findMany({
      orderBy: [desc(challenges.createdAt)],
      with: { participants: true },
    })
  }),

  getBadges: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.badges.findMany({ where: eq(badges.isActive, true) })
  }),

  createBadge: adminProcedure
    .input(z.object({
      name: z.string().min(1), description: z.string().min(1),
      icon: z.string(), category: z.enum(['ACHIEVEMENT', 'MILESTONE', 'SPECIAL', 'SCHOOL']),
      pointsRequired: z.number().int().positive().optional(),
      criteria: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [b] = await ctx.db.insert(badges).values(input).$returningId()
      return b
    }),
})
