import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { SettingsContext } from './settings'
import type { Theme, User } from './settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <SettingsContext.Provider value={{ user, theme, setUser, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  )
}
