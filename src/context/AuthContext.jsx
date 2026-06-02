import { createContext, useContext, useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import client, { setAuthToken } from '../api/client'

const AuthContext = createContext(null)

const CLEANUP_KEY = 'session_cleanup_token'
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  // Stays false until the startup cleanup (and optional JWT decode) finishes.
  // ProtectedRoute returns null while false, so the user cannot interact with
  // any form until the server session state is consistent.
  const [isAuthInitialized, setIsAuthInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // One-time startup: clear any stale server session left by a previous page load.
  // We AWAIT the fetch so the app is guaranteed not to render until the session
  // has been terminated — eliminating the race condition that caused the popup
  // to appear inconsistently.
  useEffect(() => {
    const init = async () => {
      const cleanupToken = sessionStorage.getItem(CLEANUP_KEY)
      if (cleanupToken) {
        sessionStorage.removeItem(CLEANUP_KEY)
        try {
          await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: cleanupToken }),
          })
        } catch {
          // Server unreachable — proceed anyway; the stale session will be
          // overwritten the next time the user logs in with ForceLogin.
        }
      }
      setIsAuthInitialized(true)
    }
    init()
  }, [])

  // Keep the Axios client and the sessionStorage cleanup token in sync.
  useEffect(() => {
    setAuthToken(token)
    if (token) {
      sessionStorage.setItem(CLEANUP_KEY, token)
    } else {
      sessionStorage.removeItem(CLEANUP_KEY)
    }
  }, [token])

  // Decode JWT to populate the user object whenever the token changes.
  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }
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
        isAdmin: role === 'Administrator',
      })
    } catch {
      setUser(null)
    }
  }, [token])

  const login = async (email, password, forceLogin = false) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await client.post('/auth/login', { email, password, forceLogin })
      setToken(data.token)
      return { success: true }
    } catch (err) {
      if (err.response?.status === 409 && err.response?.data?.hasActiveSession) {
        return { success: false, hasActiveSession: true }
      }
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
      const { data } = await client.post('/auth/register', { email, password, firstName, lastName })
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

  const logout = async () => {
    // Remove the cleanup token before calling the API so a subsequent page load
    // does not fire a redundant second logout for a session we are ending now.
    sessionStorage.removeItem(CLEANUP_KEY)
    try {
      await client.post('/auth/logout')
    } catch {
      // Ignore — client-side state is cleared regardless.
    }
    setToken(null)
    setUser(null)
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
