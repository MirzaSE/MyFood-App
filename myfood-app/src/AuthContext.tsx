// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { api, registerUser, loginUser } from '../src/services/ApiServices'
export interface AuthContextProps {
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
})

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('jwt') || null
  )

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('jwt', token)
    } else {
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('jwt')
    }
  }, [token])

  const register = async (email: string, password: string) => {
    await registerUser(email, password)
  }

  const login = async (username: string, password: string) => {
    const data = await loginUser(username, password)
    setToken(data.token)
  }

  const logout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
