import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Skeleton,
  Alert,
  Chip,
  Divider,
} from '@mui/material'
import { useLoans } from '../hooks/useLoans'
import { Link } from 'react-router-dom'

export default function LoansPage() {
  const { data: loans = [], isLoading, error } = useLoans()

  if (error)
    return <Alert severity="error">Error loading loans: {String(error.message ?? error)}</Alert>

  return (
    <div className="max-w-4xl mx-auto">
      <Typography variant="h4" className="mt-6 mb-6">
        Loans
      </Typography>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid item xs={12} sm={6} key={n}>
              <Card>
                <CardContent>
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="40%" />
                  <Skeleton width="50%" />
                  <Skeleton width="35%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : loans.length === 0 ? (
        <Alert severity="info">No loans found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {loans.map((l) => (
            <Grid item xs={12} sm={6} key={l.id}>
              <Card className="h-full">
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <Typography variant="h6">{l.name}</Typography>
                    {l.status && (
                      <Chip
                        label={l.status}
                        color={l.status === 'active' ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </div>

                  <Divider className="mb-3" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography variant="body2" color="text.secondary">Outstanding</Typography>
                      <Typography variant="body2">€{(l.outstanding ?? 0).toLocaleString()}</Typography>
                    </div>
                    {l.amount && (
                      <div className="flex justify-between">
                        <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                        <Typography variant="body2">€{Number(l.amount).toLocaleString()}</Typography>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <Typography variant="body2" color="text.secondary">Interest Rate</Typography>
                      <Typography variant="body2">{l.rate}%</Typography>
                    </div>
                    {l.termMonths && (
                      <div className="flex justify-between">
                        <Typography variant="body2" color="text.secondary">Term</Typography>
                        <Typography variant="body2">{l.termMonths} months</Typography>
                      </div>
                    )}
                    {l.type && (
                      <div className="flex justify-between">
                        <Typography variant="body2" color="text.secondary">Type</Typography>
                        <Typography variant="body2" className="capitalize">{l.type}</Typography>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  )
}
