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
        style={{
          background: "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0)), url('/images/toolbar.jpg') center/cover no-repeat"
        }}
        className="text-white  border-white" >
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
