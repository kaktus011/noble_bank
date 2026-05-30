import {
  Typography,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Alert,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material'
import { useLoans, useAdminLoans } from '../hooks/useLoans'
import { useAuth } from '../context/AuthContext'

export default function LoansPage() {
  const { user } = useAuth()
  const userLoans = useLoans()
  const adminLoans = useAdminLoans()
  const { data: loans = [], isLoading, error } = user?.isAdmin ? adminLoans : userLoans

  if (error)
    return <Alert severity="error">Error loading loans: {String(error.message ?? error)}</Alert>

  return (
    <div className="max-w-4xl mx-auto">
      <Typography variant="h4" className="mt-6 mb-6">
        {user?.isAdmin ? 'All Loans' : 'Loans'}
      </Typography>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid item xs={12} sm={6} key={n}>
              <Card><CardContent>
                <Skeleton width="60%" height={28} />
                <Skeleton width="40%" />
                <Skeleton width="50%" />
                <Skeleton width="35%" />
              </CardContent></Card>
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
                    <Typography variant="h6" className="capitalize">{l.type} Loan</Typography>
                    <Chip
                      label={l.status}
                      color={l.status === 'Active' ? 'success' : l.status === 'Pending' ? 'warning' : 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </div>

                  <Divider className="mb-3" />

                  <div className="space-y-2 mb-3">
                    <Row label="Amount" value={`€ ${Number(l.amount).toLocaleString()}`} />
                    <Row label="Remaining" value={`€ ${Number(l.remainingAmount).toLocaleString()}`} />
                    <Row label="Monthly Payment" value={`€ ${Number(l.monthlyPayment).toFixed(2)}`} />
                    <Row label="Interest Rate" value={`${l.interestRate}%`} />
                    <Row label="Term" value={`${l.termMonths} months`} />
                    <Row label="Start Date" value={new Date(l.startDate).toLocaleDateString('en-GB')} />
                    {l.endDate && (
                      <Row label="End Date" value={new Date(l.endDate).toLocaleDateString('en-GB')} />
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="caption" color="text.secondary">{Number(l.progressPercentage).toFixed(0)}%</Typography>
                    </div>
                    <LinearProgress variant="determinate" value={Math.min(Number(l.progressPercentage), 100)} />
                  </div>

                  {l.rejectionReason && (
                    <Alert severity="error" className="mt-3" sx={{ py: 0 }}>
                      {l.rejectionReason}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </div>
  )
}
