import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, adminProcedure } from './trpc'
import { posts, users, challenges, challengeParticipants, badges, activityLogs, schools } from '../../db/schema'
import { eq, and, desc, count, sql, lte, gte, like } from 'drizzle-orm'

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
    const totalPoints = await ctx.db.select({ total: sql<number>`COALESCE(SUM(points), 0)` }).from(users)
    const rankDistribution = await ctx.db.select({ rank: users.rank, count: count() })
      .from(users).groupBy(users.rank).orderBy(users.rank)
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
      totalPoints: Number(totalPoints[0]?.total || 0),
      rankDistribution,
    }
  }),

  getPointsOverview: adminProcedure.query(async ({ ctx }) => {
    const totalPoints = await ctx.db.select({ total: sql<number>`COALESCE(SUM(points), 0)` }).from(users)
    const avgPoints = await ctx.db.select({ avg: sql<number>`COALESCE(AVG(points), 0)` }).from(users)
    const rankDistribution = await ctx.db.select({ rank: users.rank, count: count() })
      .from(users).groupBy(users.rank).orderBy(users.rank)
    const topUsers = await ctx.db.query.users.findMany({
      columns: { id: true, fullName: true, points: true, rank: true, profileImage: true },
      orderBy: [desc(users.points)],
      limit: 10,
      with: { school: { columns: { name: true } } },
    })
    return {
      totalPoints: Number(totalPoints[0]?.total || 0),
      avgPoints: Math.round(Number(avgPoints[0]?.avg || 0)),
      rankDistribution,
      topUsers,
    }
  }),

  getPointsHistory: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.activityLogs.findMany({
      where: eq(activityLogs.action, 'POINTS_AWARDED'),
      orderBy: [desc(activityLogs.createdAt)],
      limit: 50,
    })
  }),

  awardPoints: adminProcedure
    .input(z.object({
      userId: z.string(),
      points: z.number().int().positive().max(10000),
      reason: z.string().min(1).max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({ where: eq(users.id, input.userId) })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      const newPoints = user.points + input.points
      const { calculateRank } = await import('../../contracts/index')
      const newRank = calculateRank(newPoints)
      await ctx.db.update(users).set({ points: newPoints, rank: newRank, updatedAt: new Date() })
        .where(eq(users.id, input.userId))
      await ctx.db.insert(activityLogs).values({
        userId: input.userId,
        action: 'POINTS_AWARDED',
        entity: 'USER',
        entityId: input.userId,
        details: JSON.stringify({ points: input.points, newTotal: newPoints, reason: input.reason, awardedBy: ctx.userId }),
      })
      return { success: true, newPoints, newRank }
    }),

  deductPoints: adminProcedure
    .input(z.object({
      userId: z.string(),
      points: z.number().int().positive().max(10000),
      reason: z.string().min(1).max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({ where: eq(users.id, input.userId) })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      const newPoints = Math.max(0, user.points - input.points)
      const { calculateRank } = await import('../../contracts/index')
      const newRank = calculateRank(newPoints)
      await ctx.db.update(users).set({ points: newPoints, rank: newRank, updatedAt: new Date() })
        .where(eq(users.id, input.userId))
      await ctx.db.insert(activityLogs).values({
        userId: input.userId,
        action: 'POINTS_AWARDED',
        entity: 'USER',
        entityId: input.userId,
        details: JSON.stringify({ points: -input.points, newTotal: newPoints, reason: input.reason, awardedBy: ctx.userId }),
      })
      return { success: true, newPoints, newRank }
    }),

  getUsersForPoints: adminProcedure
    .input(z.object({ search: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const searchTerm = input?.search
      if (!searchTerm) {
        return ctx.db.query.users.findMany({
          columns: { id: true, fullName: true, email: true, username: true, points: true, rank: true, profileImage: true, role: true },
          orderBy: [desc(users.points)],
          limit: 50,
          with: { school: { columns: { name: true } } },
        })
      }
      return ctx.db.query.users.findMany({
        columns: { id: true, fullName: true, email: true, username: true, points: true, rank: true, profileImage: true, role: true },
        where: sql`LOWER(${users.fullName}) LIKE LOWER(${'%' + searchTerm + '%'}) OR LOWER(${users.email}) LIKE LOWER(${'%' + searchTerm + '%'}) OR LOWER(${users.username}) LIKE LOWER(${'%' + searchTerm + '%'})`,
        orderBy: [desc(users.points)],
        limit: 50,
        with: { school: { columns: { name: true } } },
      })
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
