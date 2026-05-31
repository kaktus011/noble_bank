import { useParams, Link } from 'react-router-dom'
import { useCard, useAdminCard } from '../hooks/useCards'
import { useAuth } from '../context/AuthContext'
import {
    Card, CardContent, Typography, Button, Alert, Skeleton, Divider, Chip,
} from '@mui/material'

export default function CardDetails() {
    const { id } = useParams()
    const { user } = useAuth()

    const userCard = useCard(id)       // fires for regular users
    const adminCard = useAdminCard(id) // fires only for admins (hook checks internally)

    const { data: card, isLoading, error } = user?.isAdmin ? adminCard : userCard

    if (error)
        return <Alert severity="error">Error loading card: {String(error.message ?? error)}</Alert>

    if (isLoading)
        return (
            <div className="max-w-xl mx-auto">
                <Skeleton variant="rectangular" height={200} className="rounded" />
            </div>
        )

    if (!card)
        return <Alert severity="info">Card not found</Alert>

    const expiryFormatted = card.expiryDate
        ? new Date(card.expiryDate).toLocaleDateString('en-GB', { month: '2-digit', year: '2-digit' })
        : card.expiry ?? '—'

    return (
        <div className="max-w-xl mx-auto">
            <Button component={Link} to="/cards" size="small" className="mb-4">
                ← Back to Cards
            </Button>

            <Card className="mt-4">
                <CardContent>
                    <div className="flex items-start justify-between mb-2">
                        <Typography variant="h5">
                            {card.brand} •••• {card.last4Digits ?? card.last4}
                        </Typography>
                        {card.status && (
                            <Chip
                                label={card.status}
                                color={card.status === 'Active' ? 'success' : card.status === 'Pending' ? 'warning' : 'default'}
                                size="small"
                                variant="outlined"
                            />
                        )}
                    </div>

                    <Typography color="text.secondary" className="mb-4">
                        {card.type} — Expires {expiryFormatted}
                    </Typography>

                    <Divider className="mb-4" />

                    <div className="space-y-3">
                        <Row label="Balance" value={`${card.currency ?? '€'} ${Number(card.balance ?? 0).toFixed(2)}`} />
                        {card.creditLimit && (
                            <Row label="Credit Limit" value={`${card.currency ?? '€'} ${Number(card.creditLimit).toLocaleString()}`} />
                        )}
                    </div>

                    {user?.isAdmin && (
                        <>
                            <Divider className="my-4" />
                            <Typography variant="subtitle2" color="text.secondary" className="mb-3">
                                Admin Details
                            </Typography>
                            <div className="space-y-3">
                                <Row label="Card Holder" value={card.cardHolder ?? '—'} />
                                <Row label="Currency" value={card.currency ?? '—'} />
                                <Row label="Card Type" value={card.isCredit ? 'Credit' : 'Debit'} />
                                <Row label="Expired" value={card.isExpired ? 'Yes' : 'No'} />
                                <Row label="Card ID" value={card.id} mono />
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
