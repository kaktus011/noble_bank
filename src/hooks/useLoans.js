import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'

export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: async () => {
      const { data } = await client.get('/loans')
      return data
    },
  })
}

export function useLoan(id) {
  return useQuery({
    queryKey: ['loans', id],
    queryFn: async () => {
      const { data } = await client.get(`/loans/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useAdminLoans() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['admin', 'loans'],
    queryFn: async () => {
      const { data } = await client.get('/admin/loans')
      return data
    },
    enabled: !!user?.isAdmin,
  })
}

export function useAdminLoan(id) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['admin', 'loans', id],
    queryFn: async () => {
      const { data } = await client.get(`/admin/loans/${id}`)
      return data
    },
    enabled: !!user?.isAdmin && !!id,
  })
}

export function useRequestLoan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ amount, termMonths, type }) => {
      const { data } = await client.post('/loans/request', { amount, termMonths, type })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}

export function useApproveLoan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await client.post(`/admin/loans/${id}/approve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'loans'] })
    },
  })
}

export function useRejectLoan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      await client.post(`/admin/loans/${id}/reject`, { reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'loans'] })
    },
  })
}
