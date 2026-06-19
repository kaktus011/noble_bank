import { useState } from 'react'
import {
  Typography, Grid, Card, CardContent, Skeleton, Alert, Chip,
  Divider, LinearProgress, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useLoans, useAdminLoans, useApproveLoan, useRejectLoan } from '../hooks/useLoans'
import { useAuth } from '../context/AuthContext'

export default function LoansPage() {
  const { user } = useAuth()
  const userLoans = useLoans()
  const adminLoans = useAdminLoans()
  const { data: loans = [], isLoading, error } = user?.isAdmin ? adminLoans : userLoans

  const approveLoan = useApproveLoan()
  const rejectLoan = useRejectLoan()

  const [rejectDialog, setRejectDialog] = useState(null) // { id }
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = async (id) => {
    await approveLoan.mutateAsync(id)
  }

  const handleRejectConfirm = async () => {
    await rejectLoan.mutateAsync({ id: rejectDialog.id, reason: rejectReason })
    setRejectDialog(null)
    setRejectReason('')
  }

  if (error)
    return <Alert severity="error">Error loading loans: {String(error.message ?? error)}</Alert>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mt-6 mb-6">
        <Typography variant="h4">
          {user?.isAdmin ? 'All Loans' : 'Loans'}
        </Typography>
        {!user?.isAdmin && (
          <Button variant="contained" component={Link} to="/loans/request">
            Request a new loan
          </Button>
        )}
      </div>

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

                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <Typography variant="caption" color="text.secondary">Progress</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Number(l.progressPercentage).toFixed(0)}%
                      </Typography>
                    </div>
                    <LinearProgress variant="determinate" value={Math.min(Number(l.progressPercentage), 100)} />
                  </div>

                  {l.rejectionReason && (
                    <Alert severity="error" className="mb-3" sx={{ py: 0 }}>
                      {l.rejectionReason}
                    </Alert>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      component={Link}
                      to={`/loans/${l.id}`}
                      variant="outlined"
                      size="small"
                    >
                      View Details
                    </Button>

                    {user?.isAdmin && l.status === 'Pending' && (
                      <>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprove(l.id)}
                          disabled={approveLoan.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => setRejectDialog({ id: l.id })}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reject dialog */}
      <Dialog open={!!rejectDialog} onClose={() => { setRejectDialog(null); setRejectReason('') }} maxWidth="xs" fullWidth>
        <DialogTitle>Reject Loan</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Rejection Reason"
            fullWidth
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="mt-2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRejectDialog(null); setRejectReason('') }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleRejectConfirm}
            disabled={!rejectReason.trim() || rejectLoan.isPending}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
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
