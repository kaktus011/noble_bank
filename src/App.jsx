import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Header from './components/Header'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CardsPage from './pages/CardsPage'
import CardDetailsPage from './pages/CardDetailsPage'
import CardRequest from './pages/CardRequest'
import LoansPage from './pages/LoansPage'
import LoanDetailsPage from './pages/LoanDetailsPage'
import TransactionsPage from './pages/TransactionsPage'
import TransactionDetailsPage from './pages/TransactionDetailsPage'
import PostsPage from './pages/PostsPage'

export default function App() {
  const { token } = useAuth()

  return (
    <>
      {token && <Header />}
      <div className="px-4 py-6">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" replace /> : <RegisterPage />}
          />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute><HomePage /></ProtectedRoute>
          } />

          <Route path="/transactions" element={
            <ProtectedRoute><TransactionsPage /></ProtectedRoute>
          } />
          <Route path="/transactions/:id" element={
            <ProtectedRoute><TransactionDetailsPage /></ProtectedRoute>
          } />

          <Route path="/loans" element={
            <ProtectedRoute><LoansPage /></ProtectedRoute>
          } />
          <Route path="/loans/:id" element={
            <ProtectedRoute><LoanDetailsPage /></ProtectedRoute>
          } />

          <Route path="/cards" element={
            <ProtectedRoute><CardsPage /></ProtectedRoute>
          } />
          <Route path="/cards/request" element={
            <ProtectedRoute><CardRequest /></ProtectedRoute>
          } />
          <Route path="/cards/:id" element={
            <ProtectedRoute><CardDetailsPage /></ProtectedRoute>
          } />

          <Route path="/posts" element={
            <ProtectedRoute><PostsPage /></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}
