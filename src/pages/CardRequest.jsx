import { useState } from 'react'
import {
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    MenuItem,
    Alert,
    Box,
    InputAdornment,
    Skeleton,
} from '@mui/material'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCardOptions, useRequestCard } from '../hooks/useCards'

const CREDIT_TYPE_NAME = 'Credit'

const humanizeName = (name) =>
    name.replace(/([a-z])([A-Z])/g, '$1 $2')

export default function CardRequest() {
    const { user } = useAuth()
    const navigate = useNavigate()

    if (user?.isAdmin) return <Navigate to="/" replace />

    const { data: options, isLoading: optionsLoading, error: optionsError } = useCardOptions()
    const requestCard = useRequestCard()

    const [formData, setFormData] = useState({
        brand: '',
        type: '',
        limit: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const types = options?.types ?? []
    const brands = options?.brands ?? []

    const selectedType = types.find((t) => String(t.value) === String(formData.type))
    const isCredit = selectedType?.name === CREDIT_TYPE_NAME

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'limit') {
            let numericValue = value.replace(/\D/g, '')
            numericValue = numericValue.replace(/^0+(?!$)/, '') || '0'
            setFormData((prev) => ({ ...prev, [name]: numericValue }))
        } else if (name === 'type') {
            const nextType = types.find((t) => String(t.value) === String(value))
            const nextIsCredit = nextType?.name === CREDIT_TYPE_NAME
            setFormData((prev) => ({
                ...prev,
                type: value,
                limit: nextIsCredit ? prev.limit : '',
            }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.brand || formData.type === '') {
            setError('Please fill in all fields')
            return
        }

        let creditLimit = null
        if (isCredit) {
            if (!formData.limit) {
                setError('Please enter a credit limit')
                return
            }
            const limit = Number(formData.limit)
            if (Number.isNaN(limit)) {
                setError('Please enter a valid numeric limit amount')
                return
            }
            if (limit < 100) {
                setError('Please enter a valid limit amount greater than or equal to €100')
                return
            }
            if (limit > 30000) {
                setError('Maximum allowed limit is €30,000')
                return
            }
            creditLimit = limit
        }

        try {
            await requestCard.mutateAsync({
                type: Number(formData.type),
                brand: Number(formData.brand),
                creditLimit,
            })
            setSubmitted(true)
            setTimeout(() => navigate('/cards'), 2000)
        } catch (err) {
            const apiMessage =
                err?.response?.data?.detail ||
                err?.response?.data?.title ||
                err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors ?? {})[0]]?.[0] ||
                err?.message ||
                'Failed to submit card request'
            setError(apiMessage)
        }
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="text-center py-12">
                        <Typography variant="h5" className="mb-4 text-green-600">
                            ✓ Card Request Submitted
                        </Typography>
                        <Typography color="text.secondary" className="mb-6">
                            Your card request has been submitted successfully. You will be redirected shortly.
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Redirecting in 2 seconds...
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Typography variant="h5" className="mb-6">
                Request a New Card
            </Typography>

            <Card>
                <CardContent>
                    {optionsError && (
                        <Alert severity="error" className="mb-4">
                            Failed to load card options. Please try again later.
                        </Alert>
                    )}

                    {optionsLoading ? (
                        <Box className="space-y-4">
                            <Skeleton variant="rounded" height={56} />
                            <Skeleton variant="rounded" height={56} />
                            <Skeleton variant="rounded" height={56} />
                        </Box>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            {error && <Alert severity="error">{error}</Alert>}

                            <TextField
                                required
                                select
                                fullWidth
                                label="Card Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                variant="outlined">
                                {brands.map((b) => (
                                    <MenuItem key={b.value} value={b.value}>
                                        {humanizeName(b.name)}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                required
                                select
                                fullWidth
                                label="Card Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                variant="outlined">
                                {types.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>
                                        {humanizeName(t.name)} Card
                                    </MenuItem>
                                ))}
                            </TextField>

                            {isCredit && (
                                <TextField
                                    required
                                    fullWidth
                                    label="Credit Limit"
                                    name="limit"
                                    placeholder="Enter desired credit limit"
                                    value={formData.limit}
                                    onChange={handleChange}
                                    variant="outlined"
                                    helperText="Min €100, Max €30,000"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                    }}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                />
                            )}

                            <Box className="flex gap-4 pt-4">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className="flex-1"
                                    disabled={requestCard.isPending}>
                                    {requestCard.isPending ? 'Submitting...' : 'Submit Request'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => navigate('/')}
                                    className="flex-1"
                                    disabled={requestCard.isPending}>
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
