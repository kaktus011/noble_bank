import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Posts from './pages/Posts'
import CardDetails from './pages/CardDetails'
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'

export default function App() {
  return (
    <div className="min-h-screen">
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Noble Bank
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/posts">
            Posts
          </Button>
        </Toolbar>
      </AppBar>

      <Container className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/cards/:id" element={<CardDetails />} />
        </Routes>
      </Container>
    </div>
  )
}
