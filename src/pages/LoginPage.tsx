import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuthStore } from '../store/authStore'
import { trpc } from '../lib/trpc'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Swords } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      setAuth(data.user as any, data.token)
      toast.success(`Welcome back, ${data.user.fullName}!`)
      navigate('/')
    },
    onError: (err) => toast.error(err.message),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({ username, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Swords className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">DigiClub</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="superadmin" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
