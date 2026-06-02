import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { trpc } from '../../lib/trpc'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '../ui/dropdown-menu'
import { Sun, Moon, LogOut, User, Trophy, Swords, Home, Menu, X, Bell } from 'lucide-react'

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const { isDark, toggle } = useThemeStore()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const utils = trpc.useUtils()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'

  const navLinks = [
    { to: '/', label: 'Feed', icon: Home },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/challenges', label: 'Challenges', icon: Swords },
    { to: `/profile/${user?.id}`, label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg mr-6">
            <img src="/digiclub.svg" alt="Digiclub" className="h-8 w-8" />
            Digiclub
          </Link>
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="icon" onClick={toggle}>
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium">{user?.fullName}</div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground">{user?.email} · {user?.points} pts</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Swords className="h-4 w-4 mr-2" /> Admin Panel
                  </DropdownMenuItem>
                )}
                {user?.role === 'SUPER_ADMIN' && (
                  <DropdownMenuItem onClick={() => navigate('/super-admin')}>
                    <Swords className="h-4 w-4 mr-2" /> Super Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="md:hidden border-t p-2 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
