import { z } from 'zod'
import { router, protectedProcedure } from './trpc'
import { users, challenges, challengeParticipants, badges, seasons } from '../../db/schema'
import { eq, and, desc, count, sql, gte, lte } from 'drizzle-orm'

export const gamificationRouter = router({
  getLeaderboard: protectedProcedure
    .input(z.object({ schoolId: z.string().optional(), limit: z.number().int().positive().default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const where = input?.schoolId ? eq(users.schoolId, input.schoolId) : undefined
      const result = await ctx.db.query.users.findMany({
        where,
        orderBy: [desc(users.points)],
        limit: input?.limit || 50,
        columns: { id: true, fullName: true, profileImage: true, points: true, rank: true, schoolId: true },
        with: { school: { columns: { name: true } } },
      })
      return result.map((u, i) => ({ ...u, position: i + 1, schoolName: u.school?.name || null }))
    }),

  getChallenges: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date()
    return ctx.db.query.challenges.findMany({
      where: and(eq(challenges.status, 'ACTIVE'), lte(challenges.startDate, now), gte(challenges.endDate, now)),
      with: { badgeReward: true, participants: { where: eq(challengeParticipants.userId, ctx.userId) } },
    })
  }),

  joinChallenge: protectedProcedure
    .input(z.object({ challengeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.challengeParticipants.findFirst({
        where: and(eq(challengeParticipants.challengeId, input.challengeId), eq(challengeParticipants.userId, ctx.userId)),
      })
      if (existing) return existing
      const [p] = await ctx.db.insert(challengeParticipants).values({
        userId: ctx.userId, challengeId: input.challengeId,
      }).$returningId()
      return p
    }),

  getBadges: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.badges.findMany({ where: eq(badges.isActive, true) })
  }),

  getUserBadges: protectedProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const id = input?.userId || ctx.userId
      return ctx.db.query.userBadges.findMany({
        where: eq(users.id, id),
        with: { badge: true },
      })
    }),

  getActiveSeasons: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.seasons.findMany({ where: eq(seasons.isActive, true) })
  }),

  getSchoolLeaderboard: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.select({
      schoolId: users.schoolId,
      schoolName: sql`(SELECT name FROM schools WHERE id = ${users.schoolId})`,
      totalPoints: sql<number>`SUM(${users.points})`,
      studentCount: count(),
    }).from(users)
      .where(sql`${users.schoolId} IS NOT NULL`)
      .groupBy(users.schoolId)
      .orderBy(desc(sql`SUM(${users.points})`))
      .limit(20)
    return result.map((r, i) => ({ ...r, rank: i + 1 }))
  }),
})
