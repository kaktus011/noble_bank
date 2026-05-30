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
import { useTransactions } from '../hooks/useTransactions'

export default function TransactionsPage() {
  const navigate = useNavigate()
  const { data: tx = [], isLoading, error } = useTransactions()

  if (error)
    return <Alert severity="error">Error loading transactions: {String(error.message ?? error)}</Alert>

  return (
    <div className="max-w-3xl mx-auto">
      <Typography variant="h4" className="mt-6 mb-6">
        Transactions
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
                  secondary={t.date}
                />
                <Chip
                  label={`${t.type === 'debit' ? '-' : '+'} €${Math.abs(Number(t.amount ?? 0)).toFixed(2)}`}
                  color={t.type === 'debit' ? 'error' : 'success'}
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
