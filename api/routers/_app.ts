import { router } from './trpc'
import { authRouter } from './auth'
import { postRouter } from './post'
import { userRouter } from './user'
import { adminRouter } from './admin'
import { superAdminRouter } from './superadmin'
import { gamificationRouter } from './gamification'

export const appRouter = router({
  auth: authRouter,
  post: postRouter,
  user: userRouter,
  admin: adminRouter,
  superAdmin: superAdminRouter,
  gamification: gamificationRouter,
})

export type AppRouter = typeof appRouter
