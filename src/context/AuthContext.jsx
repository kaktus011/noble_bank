import { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // decode JWT for user info
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role,  // "Administrator" or "User"
          isAdmin: payload.role === 'Administrator'
        })
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
  }, [token])

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await client.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
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
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}