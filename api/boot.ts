import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { db } from '../db'
import { appRouter } from './routers/_app'
import { createContext } from './context'

const app = new Hono()

app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}))

app.use('/api/trpc/*', async (c, next) => {
  const handler = fetchRequestHandler({
    endpoint: '/api/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext,
  })
  const res = await handler
  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  })
})

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

export default app
