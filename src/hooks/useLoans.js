import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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