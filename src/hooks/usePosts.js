import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import client from '../api/client'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await client.get('/posts')
      return data
    },
  })
}

export function usePost(id) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const { data } = await client.get(`/posts/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ title, body }) => {
      const { data } = await client.post('/posts', { title, body })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, title, body }) => {
      const { data } = await client.put(`/posts/${id}`, { title, body })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
