import type { inferAsyncReturnType } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { db } from '../db'
import { verifyToken } from './middleware/auth'

export interface Variables {
  userId?: string
  userRole?: string
}

export async function createContext(opts: FetchCreateContextFnOptions) {
  const auth = opts.req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  let userId: string | undefined
  let userRole: string | undefined

  if (token) {
    try {
      const payload = await verifyToken(token)
      userId = payload.sub
      userRole = payload.role as string
    } catch {}
  }

  return { db, userId, userRole }
}

export type Context = inferAsyncReturnType<typeof createContext>
