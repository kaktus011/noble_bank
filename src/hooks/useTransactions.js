import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const mapPostToTransaction = (post, index) => {
  const id = `t${post.id}`
  const date = new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  // deterministic pseudo-random amount based on id
  const base = (Number(post.id) * 997) % 10000
  const sign = base % 2 === 0 ? 1 : -1
  const amount = (base % 5000) / 100 * sign
  return {
    id,
    date,
    description: post.title,
    amount: Number(amount.toFixed(2)),
    type: amount < 0 ? 'debit' : 'credit',
  }
}

const fetchTransactions = async () => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=12')
  return res.data.map((p, i) => mapPostToTransaction(p, i))
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 1000 * 30,
  })
}
