import { useParams, useLocation, Link } from 'react-router-dom'
import { Typography, Card, CardContent, Button, Alert, Skeleton, Chip, Divider } from '@mui/material'
import { useTransactions } from '../hooks/useTransactions'

export default function TransactionDetailsPage() {
  const { id } = useParams()
  const { state } = useLocation()

  const { data: tx = [], isLoading, error } = useTransactions(null, 200)

  if (error)
    return <Alert severity="error">Error loading transaction: {String(error.message ?? error)}</Alert>

  if (isLoading)
    return (
      <div className="max-w-xl mx-auto">
        <Skeleton variant="rectangular" height={200} />
      </div>
    )

  const transaction = state?.transaction ?? tx.find((t) => String(t.id) === String(id))

  if (!transaction)
    return <Alert severity="info">Transaction not found.</Alert>

  const isDebit = transaction.type === 'debit'

  return (
    <div className="max-w-xl mx-auto">
      <Button component={Link} to="/transactions" size="small" className="mb-4">
        ← Back to Transactions
      </Button>

      <Card className="mt-4">
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <Typography variant="h5">{transaction.description}</Typography>
            <Chip
              label={`${isDebit ? '-' : '+'} €${Math.abs(Number(transaction.amount ?? 0)).toFixed(2)}`}
              color={isDebit ? 'error' : 'success'}
              variant="outlined"
            />
          </div>

          <Divider className="mb-4" />

          <div className="space-y-3">
            <div className="flex justify-between">
              <Typography color="text.secondary">Type</Typography>
              <Typography className="capitalize">{transaction.type}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography color="text.secondary">Date</Typography>
              <Typography>{transaction.date}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography color="text.secondary">Amount</Typography>
              <Typography>€{Math.abs(Number(transaction.amount ?? 0)).toFixed(2)}</Typography>
            </div>
            {transaction.cardId && (
              <div className="flex justify-between">
                <Typography color="text.secondary">Card</Typography>
                <Button component={Link} to={`/cards/${transaction.cardId}`} size="small" variant="text">
                  View card
                </Button>
              </div>
            )}
            <div className="flex justify-between">
              <Typography color="text.secondary">Transaction ID</Typography>
              <Typography variant="body2" color="text.secondary">{transaction.id}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
