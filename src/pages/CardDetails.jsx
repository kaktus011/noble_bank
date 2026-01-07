import { useParams, Link } from 'react-router-dom'
import { useCards } from '../hooks/useCards'
import { Card, CardContent, Typography, Button, Alert, Skeleton } from '@mui/material'

export default function CardDetails() {
    const { id } = useParams()
    const { data: cards = [], isLoading, error } = useCards()

    if (error)
        return <Alert severity="error">Error loading card: {String(error.message ?? error)}</Alert>
    if (isLoading)
        return (
            <div className="max-w-3xl mx-auto">
                <Skeleton variant="rectangular" height={140} />
            </div>
        )

    const card = cards.find((c) => c.id === id)
    if (!card)
        return <Alert severity="info">Card not found</Alert>

    return (
        <div className="max-w-3xl mx-auto">
            <Button component={Link} to="/" size="small" className="mb-4">
                Back
            </Button>
            <Card>
                <CardContent>
                    <Typography variant="h5" className="mb-2">
                        {card.brand} • **** {card.last4}
                    </Typography>
                    <Typography color="text.secondary" className="mb-4">
                        {card.type} — Expires {card.expiry}
                    </Typography>

                    <Typography className="mb-2">Balance: ${Number(card.balance ?? 0).toFixed(2)}</Typography>
                    <Typography className="mb-2">Limit: {card.limit ? `$${card.limit}` : '—'}</Typography>
                    <Typography className="mb-2">Card ID: {card.id}</Typography>
                </CardContent>
            </Card>
        </div>
    )
}
