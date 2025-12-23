import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Posts from './pages/Posts'
import CardDetails from './pages/CardDetails'
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material'

export default function App() {
  return (
    <div className="min-h-screen">
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className="relative text-white border-white bg-[url('/images/toolbar.jpg')] bg-center bg-cover bg-no-repeat">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 to-transparent" />

        <Toolbar>
          <Typography
            color="inherit"
            variant="h6"
            component="div"
            className="flex-1 font-semibold tracking-wide drop-shadow" >
            Noble Bank
          </Typography>

          <Button
            color="inherit"
            variant="outlined"
            component={Link}
            to="/"
            className="mx-2 border-[1.5px] hover:bg-white/10" >
            Home
          </Button>

          <Button
            color="inherit"
            variant="outlined"
            component={Link}
            to="/posts"
            className="mx-2 border-[1.5px] hover:bg-white/10" >
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
