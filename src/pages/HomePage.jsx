import {
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Button,
  Skeleton,
  Alert,
  ListItemButton,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useTransactions } from '../hooks/useTransactions'
import { useLoans } from '../hooks/useLoans'
import { useCards } from '../hooks/useCards'

export default function HomePage() {
  const navigate = useNavigate()
  const { data: tx = [], isLoading: txLoading, error: txError } = useTransactions()
  const { data: loans = [], isLoading: loansLoading, error: loansError } = useLoans()
  const { data: cards = [], isLoading: cardsLoading, error: cardsError } = useCards()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Typography variant="h4" className="mt-6">
        Dashboard
      </Typography>

      <Grid container spacing={6}>
        {/* Transactions panel */}
        <Grid item xs={12} md={6}>
          <Card className="h-96 flex flex-col">
            <CardContent className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">Last Transactions</Typography>
                <Button size="small" component={Link} to="/transactions">
                  View all
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                {txError ? (
                  <Alert severity="error">Error loading transactions: {String(txError.message ?? txError)}</Alert>
                ) : txLoading ? (
                  <List>
                    {[1, 2, 3].map((n) => (
                      <ListItem key={n} className="px-0">
                        <ListItemText primary={<Skeleton width="60%" />} secondary={<Skeleton width="40%" />} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <List disablePadding>
                    {tx.slice(0, 5).map((t) => (
                      <ListItemButton
                        key={t.id}
                        className="px-0 rounded"
                        onClick={() => navigate(`/transactions/${t.id}`, { state: { transaction: t } })}
                      >
                        <ListItemText
                          primary={t.description}
                          secondary={`${t.date} • ${t.type === 'debit' ? '-' : '+'} €${Math.abs(Number(t.amount ?? 0)).toFixed(2)}`}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Loans panel */}
        <Grid item xs={12} md={6}>
          <Card className="h-96 flex flex-col">
            <CardContent className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">Available Loans</Typography>
                <Button size="small" component={Link} to="/loans">
                  View all
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                {loansError ? (
                  <Alert severity="error">Error loading loans: {String(loansError.message ?? loansError)}</Alert>
                ) : loansLoading ? (
                  <List>
                    {[1, 2, 3].map((n) => (
                      <ListItem key={n} className="px-0">
                        <ListItemText primary={<Skeleton width="40%" />} secondary={<Skeleton width="30%" />} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <List disablePadding>
                    {loans.map((l) => (
                      <ListItemButton
                        key={l.id}
                        className="px-0 rounded"
                        onClick={() => navigate(`/loans/${l.id}`, { state: { loan: l } })}
                      >
                        <ListItemText
                          primary={l.name}
                          secondary={`Outstanding: €${(l.outstanding ?? 0).toLocaleString()} • Rate: ${l.rate}%`}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Cards panel */}
        <Grid item xs={12}>
          <Card className="h-96 flex flex-col">
            <CardContent className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">Your Cards</Typography>
                <Button size="small" component={Link} to="/cards/request">
                  Request a new card
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                {cardsError ? (
                  <Alert severity="error">Error loading cards: {String(cardsError.message ?? cardsError)}</Alert>
                ) : cardsLoading ? (
                  <Grid container spacing={3}>
                    {[1, 2, 3].map((n) => (
                      <Grid item key={n} xs={12} sm={6} md={4}>
                        <Card>
                          <CardContent>
                            <Skeleton width="70%" height={24} />
                            <Skeleton width="50%" />
                            <Skeleton width="40%" />
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Grid container spacing={3}>
                    {cards.map((c) => (
                      <Grid item key={c.id} xs={12} sm={6} md={4}>
                        <Card className="hover:shadow-lg">
                          <CardContent>
                            <Typography className="font-semibold">{c.brand} • **** {c.last4}</Typography>
                            <Typography color="text.secondary" className="mb-2">
                              {c.type} — Exp: {c.expiry}
                            </Typography>
                            <Typography className="mb-3">Balance: €{Number(c.balance ?? 0).toFixed(2)}</Typography>
                            <Button component={Link} to={`/cards/${c.id}`} variant="outlined" size="small">
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
