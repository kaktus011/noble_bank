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
import { useLoanOptions, useRequestLoan } from '../hooks/useLoans'

const humanizeName = (name) =>
    name.replace(/([a-z])([A-Z])/g, '$1 $2')

export default function LoanRequest() {
    const { user } = useAuth()
    const navigate = useNavigate()

    if (user?.isAdmin) return <Navigate to="/" replace />

    const { data: options, isLoading: optionsLoading, error: optionsError } = useLoanOptions()
    const requestLoan = useRequestLoan()

    const [formData, setFormData] = useState({
        type: '',
        amount: '',
        termMonths: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const types = options?.types ?? []

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'amount' || name === 'termMonths') {
            let numericValue = value.replace(/\D/g, '')
            numericValue = numericValue.replace(/^0+(?!$)/, '') || '0'
            setFormData((prev) => ({ ...prev, [name]: numericValue }))
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }))
        }
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (formData.type === '' || !formData.amount || !formData.termMonths) {
            setError('Please fill in all fields')
            return
        }

        const amount = Number(formData.amount)
        const termMonths = Number(formData.termMonths)

        if (Number.isNaN(amount) || amount <= 0) {
            setError('Please enter a valid loan amount')
            return
        }
        if (amount > 100000) {
            setError('Maximum allowed loan amount is €100,000')
            return
        }
        if (Number.isNaN(termMonths) || termMonths <= 0) {
            setError('Please enter a valid term in months')
            return
        }
        if (termMonths > 360) {
            setError('Maximum allowed term is 360 months')
            return
        }

        try {
            await requestLoan.mutateAsync({
                type: Number(formData.type),
                amount,
                termMonths,
            })
            setSubmitted(true)
            setTimeout(() => navigate('/loans'), 2000)
        } catch (err) {
            const apiMessage =
                err?.response?.data?.detail ||
                err?.response?.data?.title ||
                err?.response?.data?.error ||
                err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors ?? {})[0]]?.[0] ||
                err?.message ||
                'Failed to submit loan request'
            setError(apiMessage)
        }
    }

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card>
                    <CardContent className="text-center py-12">
                        <Typography variant="h5" className="mb-4 text-green-600">
                            ✓ Loan Request Submitted
                        </Typography>
                        <Typography color="text.secondary" className="mb-6">
                            Your loan request has been submitted successfully. You will be redirected shortly.
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
                Request a New Loan
            </Typography>

            <Card>
                <CardContent>
                    {optionsError && (
                        <Alert severity="error" className="mb-4">
                            Failed to load loan options. Please try again later.
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
                                label="Loan Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                variant="outlined">
                                {types.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>
                                        {humanizeName(t.name)} Loan
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                required
                                fullWidth
                                label="Loan Amount"
                                name="amount"
                                placeholder="Enter desired loan amount"
                                value={formData.amount}
                                onChange={handleChange}
                                variant="outlined"
                                helperText="Max €100,000"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />

                            <TextField
                                required
                                fullWidth
                                label="Term (months)"
                                name="termMonths"
                                placeholder="e.g. 60"
                                value={formData.termMonths}
                                onChange={handleChange}
                                variant="outlined"
                                helperText="Max 360 months"
                                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            />

                            <Box className="flex gap-4 pt-4">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className="flex-1"
                                    disabled={requestLoan.isPending}>
                                    {requestLoan.isPending ? 'Submitting...' : 'Submit Request'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => navigate('/loans')}
                                    className="flex-1"
                                    disabled={requestLoan.isPending}>
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
