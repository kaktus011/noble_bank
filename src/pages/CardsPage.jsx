import { useState } from 'react'
import {
  Typography, Grid, Card, CardContent, Button, Skeleton, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { useCards, useAdminCards, useApproveCard, useRejectCard } from '../hooks/useCards'
import { useAuth } from '../context/AuthContext'

export default function CardsPage() {
  const { user } = useAuth()
  const userCards = useCards()
  const adminCards = useAdminCards()
  const { data: cards = [], isLoading, error } = user?.isAdmin ? adminCards : userCards

  const approveCard = useApproveCard()
  const rejectCard = useRejectCard()

  const [rejectDialog, setRejectDialog] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = async (id) => {
    await approveCard.mutateAsync(id)
  }

  const handleRejectConfirm = async () => {
    await rejectCard.mutateAsync({ id: rejectDialog.id, reason: rejectReason })
    setRejectDialog(null)
    setRejectReason('')
  }

  if (error)
    return <Alert severity="error">Error loading cards: {String(error.message ?? error)}</Alert>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mt-6 mb-6">
        <Typography variant="h4">{user?.isAdmin ? 'All Cards' : 'Your Cards'}</Typography>
        {!user?.isAdmin && (
          <Button variant="contained" component={Link} to="/cards/request">
            Request a new card
          </Button>
        )}
      </div>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((n) => (
            <Grid item xs={12} sm={6} md={4} key={n}>
              <Card><CardContent>
                <Skeleton width="70%" height={24} />
                <Skeleton width="50%" />
                <Skeleton width="40%" />
                <Skeleton width="30%" />
              </CardContent></Card>
            </Grid>
          ))}
        </Grid>
      ) : cards.length === 0 ? (
        <Alert severity="info">No cards found.</Alert>
      ) : (
        <Grid container spacing={3}>
          {cards.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c.id}>
              <Card className="hover:shadow-lg h-full">
                <CardContent>
                  <Typography variant="h6" className="font-semibold mb-1">
                    {c.brand} • **** {c.last4Digits ?? c.last4}
                  </Typography>
                  <Typography color="text.secondary" className="mb-1">
                    {c.type} — Exp: {c.expiryDate
                      ? new Date(c.expiryDate).toLocaleDateString('en-GB', { month: '2-digit', year: '2-digit' })
                      : c.expiry}
                  </Typography>
                  <Typography className="mb-1">
                    Balance: {c.currency ?? 'EUR'} {Number(c.balance ?? 0).toFixed(2)}
                  </Typography>
                  {(c.creditLimit ?? c.limit) ? (
                    <Typography color="text.secondary" className="mb-1">
                      Limit: {c.currency ?? 'EUR'} {Number(c.creditLimit ?? c.limit).toLocaleString()}
                    </Typography>
                  ) : null}
                  {c.status && (
                    <Typography
                      variant="caption"
                      color={c.status === 'Active' ? 'success.main' : c.status === 'Pending' ? 'warning.main' : 'text.secondary'}
                      className="block mb-2"
                    >
                      {c.status}
                    </Typography>
                  )}
                  <div className="flex gap-2 flex-wrap mt-2">
                    <Button component={Link} to={`/cards/${c.id}`} variant="outlined" size="small">
                      View Details
                    </Button>
                    {user?.isAdmin && c.status === 'Pending' && (
                      <>
                        <Button
                          variant="contained" color="success" size="small"
                          onClick={() => handleApprove(c.id)}
                          disabled={approveCard.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained" color="error" size="small"
                          onClick={() => setRejectDialog({ id: c.id })}
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

      <Dialog
        open={!!rejectDialog}
        onClose={() => { setRejectDialog(null); setRejectReason('') }}
        maxWidth="xs" fullWidth
      >
        <DialogTitle>Reject Card Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus label="Rejection Reason" fullWidth multiline rows={3}
            value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setRejectDialog(null); setRejectReason('') }}>Cancel</Button>
          <Button
            variant="contained" color="error" onClick={handleRejectConfirm}
            disabled={!rejectReason.trim() || rejectCard.isPending}
          >
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
