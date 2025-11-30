import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

const brands = ['Visa', 'Mastercard', 'Amex']

const mapUserToCard = (user, idx) => {
  const id = `c${user.id}`
  const brand = brands[idx % brands.length]
  const last4 = (user.phone || String(user.id)).replace(/\D/g, '').slice(-4).padStart(4, '0')
  const isCredit = idx % 2 === 0
  const balance = Number(((user.id * 73) % 2000).toFixed(2))
  const limit = isCredit ? 5000 : 0
  const expiryMonth = String((user.id % 12) + 1).padStart(2, '0')
  const expiryYear = String(25 + (user.id % 3))
  return {
    id,
    brand,
    last4,
    type: isCredit ? 'Credit' : 'Debit',
    balance,
    limit,
    expiry: `${expiryMonth}/${expiryYear}`,
  }
}

const fetchCards = async () => {
  const res = await axios.get('https://jsonplaceholder.typicode.com/users?_limit=6')
  return res.data.map((u, i) => mapUserToCard(u, i))
}

export function useCards() {
  return useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards,
    staleTime: 1000 * 60,
  })
}
