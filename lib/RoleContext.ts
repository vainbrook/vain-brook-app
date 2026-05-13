import { createContext } from 'react'

export const RoleContext = createContext<{ role: string; setRole: (r: string) => void }>({
  role: 'COO',
  setRole: () => {},
})
