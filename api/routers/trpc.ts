import { initTRPC, TRPCError } from '@trpc/server'
import type { Context } from '../context'
import { db } from '../../db'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

const isAuthenticated = middleware(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  return next({ ctx: { ...ctx, userId: ctx.userId!, userRole: ctx.userRole! } })
})

const isAdmin = middleware(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  if (ctx.userRole !== 'ADMIN' && ctx.userRole !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' })
  }
  return next({ ctx: { ...ctx, userId: ctx.userId!, userRole: ctx.userRole! } })
})

const isSuperAdmin = middleware(({ ctx, next }) => {
  if (!ctx.userId) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  if (ctx.userRole !== 'SUPER_ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Super admin access required' })
  }
  return next({ ctx: { ...ctx, userId: ctx.userId!, userRole: ctx.userRole! } })
})

export const protectedProcedure = t.procedure.use(isAuthenticated)
export const adminProcedure = t.procedure.use(isAdmin)
export const superAdminProcedure = t.procedure.use(isSuperAdmin)
