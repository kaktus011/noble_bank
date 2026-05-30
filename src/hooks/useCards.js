import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  return useQuery({
    queryKey: ['admin', 'cards'],
    queryFn: async () => {
      const { data } = await client.get('/admin/cards')
      return data
    },
  })
}

export function useAdminCard(id) {
  return useQuery({
    queryKey: ['admin', 'cards', id],
    queryFn: async () => {
      const { data } = await client.get(`/admin/cards/${id}`)
      return data
    },
    enabled: !!id,
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
