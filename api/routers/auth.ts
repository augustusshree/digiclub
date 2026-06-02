import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from './trpc'
import { users } from '../../db/schema'
import { eq, or } from 'drizzle-orm'
import { hashPassword, comparePassword, signToken } from '../middleware/auth'

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: or(eq(users.username, input.username), eq(users.email, input.username)),
      })
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' })
      if (!user.isActive) throw new TRPCError({ code: 'FORBIDDEN', message: 'Account is disabled' })
      const valid = await comparePassword(input.password, user.passwordHash)
      if (!valid) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' })
      const token = await signToken({ userId: user.id, role: user.role, email: user.email })
      const { passwordHash, ...safeUser } = user
      return { user: safeUser, token }
    }),

  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(6),
      fullName: z.string().min(1),
      username: z.string().min(3),
      schoolId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.users.findFirst({
        where: or(eq(users.email, input.email), eq(users.username, input.username)),
      })
      if (existing) throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' })
      const passwordHash = await hashPassword(input.password)
      const [user] = await ctx.db.insert(users).values({
        username: input.username,
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        schoolId: input.schoolId,
        role: 'STUDENT',
      }).$returningId()
      const fullUser = await ctx.db.query.users.findFirst({ where: eq(users.id, user.id) })
      if (!fullUser) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      const token = await signToken({ userId: fullUser.id, role: fullUser.role, email: fullUser.email })
      const { passwordHash: _, ...safeUser } = fullUser
      return { user: safeUser, token }
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.userId),
      with: { school: true },
    })
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    const { passwordHash, ...safeUser } = user
    return safeUser
  }),
})
