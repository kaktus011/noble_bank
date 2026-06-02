import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  TextField, Button, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sessionConflict, setSessionConflict] = useState(false)
  const { login, isLoading, error, isAuthInitialized } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) navigate('/')
    else if (result.hasActiveSession) setSessionConflict(true)
  }

  const handleForceLogin = async () => {
    setSessionConflict(false)
    const result = await login(email, password, true)
    if (result.success) navigate('/')
    else if (result.hasActiveSession) setSessionConflict(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Noble Bank</h1>
        <h2 className="text-xl mb-4 text-center text-gray-600">Login</h2>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading || !isAuthInitialized}
            size="large"
          >
            {isLoading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          No account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>

      {/* Session conflict dialog */}
      <Dialog open={sessionConflict} onClose={() => setSessionConflict(false)}>
        <DialogTitle>Active Session Detected</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This account already has an active session on another device or browser window.
            Would you like to terminate that session and log in here instead?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionConflict(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleForceLogin} disabled={isLoading}>
            {isLoading ? <CircularProgress size={20} /> : 'Yes, terminate it'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
