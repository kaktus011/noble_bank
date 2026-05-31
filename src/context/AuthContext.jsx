import { createContext, useContext, useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // decode JWT for user info
  useEffect(() => {
    setIsAuthInitialized(false)

    if (token) {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
        const payload = JSON.parse(atob(padded))
        const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        setUser({
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role,
          isAdmin: role === 'Administrator'
        })
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }

    setIsAuthInitialized(true)
  }, [token])

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await client.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setIsAuthInitialized(false)
      setToken(data.token)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email, password, firstName, lastName) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await client.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
      })
      localStorage.setItem('token', data.token)
      setIsAuthInitialized(false)
      setToken(data.token)
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed'
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsAuthInitialized(true)
    queryClient.clear()
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthInitialized, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}