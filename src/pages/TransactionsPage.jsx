import {
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Skeleton,
  Alert,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTransactions, useAdminTransactions } from '../hooks/useTransactions'
import { useAuth } from '../context/AuthContext'

export default function TransactionsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userTx = useTransactions()
  const adminTx = useAdminTransactions()
  const { data: tx = [], isLoading, error } = user?.isAdmin ? adminTx : userTx

  if (error)
    return <Alert severity="error">Error loading transactions: {String(error.message ?? error)}</Alert>

  return (
    <div className="max-w-3xl mx-auto">
      <Typography variant="h4" className="mt-6 mb-6">
        {user?.isAdmin ? 'All Transactions' : 'Transactions'}
      </Typography>

      {isLoading ? (
        <List>
          {[1, 2, 3, 4, 5].map((n) => (
            <ListItemButton key={n} disabled>
              <ListItemText primary={<Skeleton width="50%" />} secondary={<Skeleton width="30%" />} />
            </ListItemButton>
          ))}
        </List>
      ) : tx.length === 0 ? (
        <Alert severity="info">No transactions found.</Alert>
      ) : (
        <List disablePadding>
          {tx.map((t, i) => (
            <div key={t.id}>
              <ListItemButton
                onClick={() => navigate(`/transactions/${t.id}`, { state: { transaction: t } })}
              >
                <ListItemText
                  primary={t.description}
                  secondary={
                    <>
                      {new Date(t.occurredAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {user?.isAdmin && t.cardLast4 && ` • Card ••••${t.cardLast4}`}
                    </>
                  }
                />
                <Chip
                  label={`${t.type === 'Expense' ? '-' : '+'} €${Math.abs(Number(t.amount ?? 0)).toFixed(2)}`}
                  color={t.type === 'Expense' ? 'error' : 'success'}
                  variant="outlined"
                  size="small"
                />
              </ListItemButton>
              {i < tx.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      )}
    </div>
  )
}
