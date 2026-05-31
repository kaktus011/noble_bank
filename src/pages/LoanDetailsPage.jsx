import { useParams, Link } from 'react-router-dom'
import {
  Typography, Card, CardContent, Button, Alert, Skeleton,
  Chip, Divider, LinearProgress,
} from '@mui/material'
import { useLoan, useAdminLoan } from '../hooks/useLoans'
import { useAuth } from '../context/AuthContext'

export default function LoanDetailsPage() {
  const { id } = useParams()
  const { user } = useAuth()

  const userLoan = useLoan(id)       // enabled when id is set; fires for regular users
  const adminLoan = useAdminLoan(id) // enabled only when admin (hook checks internally)

  const { data: loan, isLoading, error } = user?.isAdmin ? adminLoan : userLoan

  if (error)
    return <Alert severity="error">Error loading loan: {String(error.message ?? error)}</Alert>

  if (isLoading)
    return <div className="max-w-xl mx-auto"><Skeleton variant="rectangular" height={300} /></div>

  if (!loan)
    return <Alert severity="info">Loan not found.</Alert>

  return (
    <div className="max-w-xl mx-auto">
      <Button component={Link} to="/loans" size="small" className="mb-4">
        ← Back to Loans
      </Button>

      <Card className="mt-4">
        <CardContent>
          <div className="flex items-start justify-between mb-2">
            <Typography variant="h5" className="capitalize">{loan.type} Loan</Typography>
            <Chip
              label={loan.status}
              color={loan.status === 'Active' ? 'success' : loan.status === 'Pending' ? 'warning' : 'default'}
              variant="outlined"
            />
          </div>

          <Divider className="mb-4" />

          <div className="space-y-3 mb-4">
            <Row label="Amount" value={`€ ${Number(loan.amount).toLocaleString()}`} />
            <Row label="Remaining" value={`€ ${Number(loan.remainingAmount).toLocaleString()}`} />
            <Row label="Monthly Payment" value={`€ ${Number(loan.monthlyPayment).toFixed(2)}`} />
            <Row label="Interest Rate" value={`${loan.interestRate}%`} />
            <Row label="Term" value={`${loan.termMonths} months`} />
            <Row label="Start Date" value={new Date(loan.startDate).toLocaleDateString('en-GB')} />
            {loan.endDate && (
              <Row label="End Date" value={new Date(loan.endDate).toLocaleDateString('en-GB')} />
            )}
          </div>

          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <Typography variant="caption" color="text.secondary">Repayment Progress</Typography>
              <Typography variant="caption" color="text.secondary">
                {Number(loan.progressPercentage).toFixed(0)}%
              </Typography>
            </div>
            <LinearProgress variant="determinate" value={Math.min(Number(loan.progressPercentage), 100)} />
          </div>

          {loan.rejectionReason && (
            <Alert severity="error" className="mb-4">
              Rejection reason: {loan.rejectionReason}
            </Alert>
          )}

          {user?.isAdmin && (
            <>
              <Divider className="mb-4" />
              <Typography variant="subtitle2" color="text.secondary" className="mb-3">
                Admin Details
              </Typography>
              <div className="space-y-3">
                <Row label="User ID" value={loan.userId} mono />
                <Row label="Loan ID" value={loan.id} mono />
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
