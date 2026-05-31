import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

export function useTransactions(cardId = null, limit = 50) {
  return useQuery({
    queryKey: ['transactions', cardId, limit],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (cardId) params.append('cardId', cardId)
      if (limit) params.append('limit', limit)
      const { data } = await client.get(`/transactions?${params}`)
      return data
    },
  })
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: ['admin', 'transactions'],
    queryFn: async () => {
      const { data } = await client.get('/admin/transactions')
      return data
    },
  })
}

export function useAdminTransaction(id) {
  return useQuery({
    queryKey: ['admin', 'transactions', id],
    queryFn: async () => {
      const { data } = await client.get(`/admin/transactions/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ cardId, amount, description, type }) => {
      const { data } = await client.post('/transactions', {
        cardId,
        amount,
        description,
        type,
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}