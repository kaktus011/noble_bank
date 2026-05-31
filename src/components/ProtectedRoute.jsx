import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user, isAuthInitialized } = useAuth()

  if (!isAuthInitialized) {
    return null
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}