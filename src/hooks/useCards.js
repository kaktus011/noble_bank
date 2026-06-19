import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import client from '../api/client'

export function useCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const { data } = await client.get('/cards')
      return data
    },
  })
}

export function useCard(id) {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: async () => {
      const { data } = await client.get(`/cards/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useAdminCards() {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['admin', 'cards'],
    queryFn: async () => {
      const { data } = await client.get('/admin/cards')
      return data
    },
    enabled: !!user?.isAdmin,
  })
}

export function useAdminCard(id) {
  const { user } = useAuth()
  return useQuery({
    queryKey: ['admin', 'cards', id],
    queryFn: async () => {
      const { data } = await client.get(`/admin/cards/${id}`)
      return data
    },
    enabled: !!user?.isAdmin && !!id,
  })
}

export function useCardOptions() {
  return useQuery({
    queryKey: ['cards', 'options'],
    queryFn: async () => {
      const { data } = await client.get('/cards/options')
      return data
    },
    staleTime: 1000 * 60 * 60,
  })
}

export function useRequestCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ type, brand, creditLimit }) => {
      const { data } = await client.post('/cards/request', { type, brand, creditLimit })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}

export function useApproveCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await client.post(`/admin/cards/${id}/approve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cards'] })
    },
  })
}

export function useRejectCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }) => {
      await client.post(`/admin/cards/${id}/reject`, { reason })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'cards'] })
    },
  })
}
