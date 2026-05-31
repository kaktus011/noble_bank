import { useParams, useLocation, Link } from 'react-router-dom'
import { Typography, Card, CardContent, Button, Alert, Skeleton, Chip, Divider } from '@mui/material'
import { useTransactions, useAdminTransaction } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'

export default function TransactionDetailsPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const { user } = useAuth()

  const userTxList = useTransactions(null, 200) // fires for regular users
  const adminTx = useAdminTransaction(id)        // fires only for admins (hook checks internally)

  if (user?.isAdmin ? adminTx.error : userTxList.error) {
    const err = user?.isAdmin ? adminTx.error : userTxList.error
    return <Alert severity="error">Error loading transaction: {String(err.message ?? err)}</Alert>
  }

  if (user?.isAdmin ? adminTx.isLoading : userTxList.isLoading)
    return <div className="max-w-xl mx-auto"><Skeleton variant="rectangular" height={200} /></div>

  const transaction = user?.isAdmin
    ? adminTx.data
    : (state?.transaction ?? (Array.isArray(userTxList.data) ? userTxList.data.find((t) => String(t.id) === String(id)) : null))

  if (!transaction)
    return <Alert severity="info">Transaction not found.</Alert>

  const isDebit = transaction.type === 'Debit'
  const dateFormatted = transaction.occurredAt
    ? new Date(transaction.occurredAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : '—'

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
            <Row label="Type" value={transaction.type} />
            <Row label="Date" value={dateFormatted} />
            <Row label="Amount" value={`€ ${Math.abs(Number(transaction.amount ?? 0)).toFixed(2)}`} />
            {transaction.cardLast4 && (
              <Row label="Card" value={`•••• ${transaction.cardLast4}`} />
            )}
          </div>

          {user?.isAdmin && (
            <>
              <Divider className="my-4" />
              <Typography variant="subtitle2" color="text.secondary" className="mb-3">
                Admin Details
              </Typography>
              <div className="space-y-3">
                {transaction.cardId && (
                  <div className="flex justify-between items-center">
                    <Typography color="text.secondary">Card</Typography>
                    <Button component={Link} to={`/cards/${transaction.cardId}`} size="small" variant="text">
                      View card ••••{transaction.cardLast4}
                    </Button>
                  </div>
                )}
                <Row label="Transaction ID" value={transaction.id} mono />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex justify-between items-center">
      <Typography color="text.secondary">{label}</Typography>
      <Typography
        variant="body2"
        sx={mono ? { fontFamily: 'monospace', fontSize: '0.75rem', color: 'text.secondary' } : {}}
      >
        {value}
      </Typography>
    </div>
  )
}
