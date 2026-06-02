import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from './trpc'
import { users } from '../../db/schema'
import { eq, sql, desc } from 'drizzle-orm'

export const userRouter = router({
  getProfile: protectedProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const id = input?.userId || ctx.userId
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          school: true,
          userBadges: { with: { badge: true } },
          posts: { limit: 10, orderBy: (p, { desc }) => [desc(p.createdAt)] },
        },
      })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      const { passwordHash, ...safeUser } = user
      return safeUser
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      fullName: z.string().min(1).optional(),
      bio: z.string().optional(),
      profileImage: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.userId))
      return { success: true }
    }),

  getLeaderboard: publicProcedure
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
      return result.map((u, i) => ({ ...u, schoolName: u.school?.name || null, position: i + 1 }))
    }),
})
