import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      <Toolbar className="max-w-6xl mx-auto w-full">
        {/* Logo / Brand */}
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: '0.05em',
            color: 'white',
            textDecoration: 'none',
            '&:hover': { opacity: 0.85 },
          }}
        >
          Noble Bank
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/cards">
            Cards
          </Button>
          <Button color="inherit" component={Link} to="/transactions">
            Transactions
          </Button>
          <Button color="inherit" component={Link} to="/loans">
            Loans
          </Button>
          <Button color="inherit" component={Link} to="/posts">
            Posts
          </Button>

          {/* Divider */}
          <Box sx={{ width: '1px', height: 24, bgcolor: 'rgba(255,255,255,0.3)', mx: 1 }} />

          {user && (
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mr: 1 }}>
              {user.name || user.email}
            </Typography>
          )}
          <Button
            color="inherit"
            variant="outlined"
            size="small"
            onClick={handleLogout}
            sx={{ borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: 'white' } }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
