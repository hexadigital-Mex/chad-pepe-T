import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export interface User {
  name: string
}

export interface SettingsContextValue {
  user: User | null
  theme: Theme
  setUser: (user: User | null) => void
  toggleTheme: () => void
}

export const SettingsContext = createContext<SettingsContextValue>({
  user: null,
  theme: 'light',
  setUser: () => {},
  toggleTheme: () => {},
})

export function useSettings() {
  return useContext(SettingsContext)
}
