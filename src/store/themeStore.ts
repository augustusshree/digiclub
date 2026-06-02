import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  isDark: boolean
  toggle: () => void
  setDark: (dark: boolean) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () => set((s) => { const v = !s.isDark; document.documentElement.classList.toggle('dark', v); return { isDark: v } }),
      setDark: (dark) => set({ isDark: dark }),
    }),
    { name: 'digiclub_theme' }
  )
)
