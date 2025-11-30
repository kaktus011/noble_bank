import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const mapTodoToLoan = (todo) => ({
  id: `l${todo.id}`,
  name: todo.title,
  outstanding: ((todo.id * 137) % 100000) + 500, // deterministic amount
  rate: Number((1 + (todo.id % 5) * 0.5).toFixed(2)),
  status: todo.completed ? 'paid' : 'active',
})

const fetchLoans = async () => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=6')
  return res.data.map(mapTodoToLoan)
}

export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: fetchLoans,
    staleTime: 1000 * 60,
  })
}
