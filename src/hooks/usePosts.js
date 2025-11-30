import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const fetchPosts = async () => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
  return res.data
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 1, // 1 minute
    cacheTime: 1000 * 60 * 5,
  })
}
