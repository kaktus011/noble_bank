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
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function CardRequest() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        brand: '',
        cardType: '',
        limit: '',
    })
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validation
        if (!formData.brand || !formData.cardType || !formData.limit) {
            setError('Please fill in all fields')
            return
        }

        const limit = Number(formData.limit)
        if (Number.isNaN(limit) || limit < 100) {
            setError('Please enter a valid limit amount greater than or equal to 100')
            return
        }
        if (limit > 30000) {
            setError('Maximum allowed limit is 30000')
            return
        }

        // Simulate successful submission
        // TODO : Integrate with backend API
        setSubmitted(true)
        setTimeout(() => {
            navigate('/')
        }, 2000)
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
                            Your card request has been submitted successfully. You will be redirected to the home page.
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <Alert severity="error">{error}</Alert>}

                        <TextField
                            select
                            fullWidth
                            label="Card Brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            variant="outlined">
                            <MenuItem value="Visa">Visa</MenuItem>
                            <MenuItem value="Mastercard">Mastercard</MenuItem>
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label="Card Type"
                            name="cardType"
                            value={formData.cardType}
                            onChange={handleChange}
                            variant="outlined">
                            <MenuItem value="credit">Credit Card</MenuItem>
                            <MenuItem value="debit">Debit Card</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            label={formData.cardType === 'debit' ? 'Spending Limit' : 'Credit Limit'}
                            name="limit"
                            type="number"
                            placeholder={
                                formData.cardType === 'debit'
                                    ? 'Enter desired spending limit'
                                    : 'Enter desired credit limit'
                            }
                            value={formData.limit}
                            onChange={handleChange}
                            variant="outlined"
                            helperText="Max limit 30000"
                            inputProps={{ step: '100', min: '100', max: '30000' }}
                        />

                        <Box className="flex gap-4 pt-4">
                            <Button variant="contained" color="primary" type="submit" className="flex-1">
                                Submit Request
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => navigate('/')}
                                className="flex-1">
                                Cancel
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
