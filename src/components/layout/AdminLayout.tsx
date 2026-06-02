import { Link, Outlet, useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '../../store/authStore'
import { useThemeStore } from '../../store/themeStore'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Sun, Moon, LogOut, LayoutDashboard, FileText, Award, Swords, GraduationCap, Shield, ArrowLeft, School, Coins } from 'lucide-react'

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const { isDark, toggle } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()

  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/posts', label: 'Posts', icon: FileText },
    { to: '/admin/challenges', label: 'Challenges', icon: Award },
    { to: '/admin/badges', label: 'Badges', icon: Shield },
    { to: '/admin/points', label: 'Points', icon: Coins },
  ]

  const superAdminLinks = [
    { to: '/super-admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/super-admin/admins', label: 'Admins', icon: GraduationCap },
    { to: '/super-admin/schools', label: 'Schools', icon: School },
  ]

  const links = isSuperAdmin && location.pathname.startsWith('/super-admin') ? superAdminLinks : adminLinks

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="flex h-14 items-center px-4 max-w-7xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg ml-2">
            <img src="/digiclub.svg" alt="Digiclub" className="h-8 w-8" />
            Digiclub Admin
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>
                <Button variant={location.pathname === link.to ? 'secondary' : 'ghost'} size="sm" className="gap-2">
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
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/login') }}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
