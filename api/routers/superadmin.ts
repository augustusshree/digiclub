import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, superAdminProcedure } from './trpc'
import { users, schools, activityLogs } from '../../db/schema'
import { eq, desc, count } from 'drizzle-orm'
import { hashPassword } from '../middleware/auth'

export const superAdminRouter = router({
  getDashboard: superAdminProcedure.query(async ({ ctx }) => {
    const totalUsers = await ctx.db.select({ count: count() }).from(users)
    const totalSchools = await ctx.db.select({ count: count() }).from(schools)
    const recentActivity = await ctx.db.query.activityLogs.findMany({
      orderBy: [desc(activityLogs.createdAt)],
      limit: 20,
      with: { user: { columns: { id: true, fullName: true } } },
    })
    return {
      totalUsers: Number(totalUsers[0]?.count || 0),
      totalSchools: Number(totalSchools[0]?.count || 0),
      recentActivity,
    }
  }),

  getAdmins: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      where: eq(users.role, 'ADMIN'),
      with: { school: { columns: { name: true } } },
      columns: { id: true, fullName: true, email: true, username: true, isActive: true, schoolId: true, createdAt: true },
    })
  }),

  createAdmin: superAdminProcedure
    .input(z.object({
      email: z.string().email(), fullName: z.string().min(1),
      schoolId: z.string(), password: z.string().min(6),
    }))
    .mutation(async ({ ctx, input }) => {
      const passwordHash = await hashPassword(input.password)
      const [u] = await ctx.db.insert(users).values({
        username: `admin_${input.email.split('@')[0]}`,
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        role: 'ADMIN',
        schoolId: input.schoolId,
        points: 5000,
        rank: 'APEX',
      }).$returningId()
      return u
    }),

  toggleAdminStatus: superAdminProcedure
    .input(z.object({ userId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(users).set({ isActive: input.isActive }).where(eq(users.id, input.userId))
      return { success: true }
    }),

  getSchools: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.db.query.schools.findMany({ orderBy: [desc(schools.createdAt)] })
  }),

  createSchool: superAdminProcedure
    .input(z.object({ name: z.string().min(1), code: z.string().min(1), city: z.string().optional(), state: z.string().optional(), logo: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const [s] = await ctx.db.insert(schools).values(input).$returningId()
      return s
    }),

  toggleSchoolStatus: superAdminProcedure
    .input(z.object({ schoolId: z.string(), isActive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(schools).set({ isActive: input.isActive, updatedAt: new Date() }).where(eq(schools.id, input.schoolId))
      return { success: true }
    }),

  getAllActivity: superAdminProcedure
    .input(z.object({ limit: z.number().int().positive().default(50) }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.activityLogs.findMany({
        orderBy: [desc(activityLogs.createdAt)],
        limit: input?.limit || 50,
        with: { user: { columns: { id: true, fullName: true } } },
      })
    }),
})
