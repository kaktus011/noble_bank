import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Skeleton,
  Alert,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useCards } from '../hooks/useCards'

export default function CardsPage() {
  const { data: cards = [], isLoading, error } = useCards()

  if (error)
    return <Alert severity="error">Error loading cards: {String(error.message ?? error)}</Alert>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mt-6 mb-6">
        <Typography variant="h4">Your Cards</Typography>
        <Button variant="contained" component={Link} to="/cards/request">
          Request a new card
        </Button>
      </div>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Card>
                <CardContent>
                  <Skeleton width="70%" height={24} />
                  <Skeleton width="50%" />
                  <Skeleton width="40%" />
                  <Skeleton width="30%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : cards.length === 0 ? (
        <Alert severity="info">You have no cards yet.</Alert>
      ) : (
        <Grid container spacing={3}>
          {cards.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Card className="hover:shadow-lg h-full">
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-1">
                    {c.brand} • **** {c.last4}
                  </Typography>
                  <Typography color="text.secondary" className="mb-1">
                    {c.type} — Exp: {c.expiry}
                  </Typography>
                  <Typography className="mb-1">
                    Balance: €{Number(c.balance ?? 0).toFixed(2)}
                  </Typography>
                  {c.limit && (
                    <Typography color="text.secondary" className="mb-3">
                      Limit: €{Number(c.limit).toLocaleString()}
                    </Typography>
                  )}
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
  )
}
