import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { Toaster } from './components/ui/toaster'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FeedPage from './pages/FeedPage'
import ProfilePage from './pages/ProfilePage'
import LeaderboardPage from './pages/LeaderboardPage'
import ChallengesPage from './pages/ChallengesPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPosts from './pages/admin/AdminPosts'
import AdminChallenges from './pages/admin/AdminChallenges'
import AdminBadges from './pages/admin/AdminBadges'
import AdminPoints from './pages/admin/AdminPoints'
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard'
import SuperAdminAdmins from './pages/superadmin/SuperAdminAdmins'
import SuperAdminSchools from './pages/superadmin/SuperAdminSchools'
import AppLayout from './components/layout/AppLayout'
import AdminLayout from './components/layout/AdminLayout'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const isDark = useThemeStore((s) => s.isDark)

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [isDark])

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/profile/:id?" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/challenges" element={<AdminChallenges />} />
          <Route path="/admin/badges" element={<AdminBadges />} />
          <Route path="/admin/points" element={<AdminPoints />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AdminLayout /></ProtectedRoute>}>
          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/admins" element={<SuperAdminAdmins />} />
          <Route path="/super-admin/schools" element={<SuperAdminSchools />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}
