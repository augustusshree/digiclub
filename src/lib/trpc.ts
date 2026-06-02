import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import type { AppRouter } from '../../api/routers/_app'

export const trpc = createTRPCReact<AppRouter>()

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('digiclub_auth')
    if (stored) return JSON.parse(stored).token || null
  } catch {}
  return null
}

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers() {
          const token = getToken()
          return token ? { Authorization: `Bearer ${token}` } : {}
        },
      }),
    ],
  })
}
