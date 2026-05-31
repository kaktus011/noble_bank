import { useState } from 'react'
import { usePosts, useCreatePost, useDeletePost } from '../hooks/usePosts'
import { useAuth } from '../context/AuthContext'
import {
    Grid, Card, CardContent, CardActions, Typography, Skeleton, Alert,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, IconButton, Tooltip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

const TITLE_MAX = 200
const BODY_MAX = 500

function parseApiError(error) {
    const data = error?.response?.data
    if (!data) return error?.message ?? 'Something went wrong.'

    // FluentValidation / ASP.NET validation error shape: { errors: { Field: ['msg'] } }
    if (data.errors) {
        return Object.values(data.errors).flat().join(' ')
    }
    if (typeof data === 'string') return data
    if (data.title) return data.title
    return 'Something went wrong.'
}

export default function Posts() {
    const { data, isLoading, error } = usePosts()
    const { user } = useAuth()
    const createPost = useCreatePost()
    const deletePost = useDeletePost()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [submitError, setSubmitError] = useState(null)

    const handleClose = () => {
        setDialogOpen(false)
        setTitle('')
        setBody('')
        setSubmitError(null)
    }

    const handleCreate = async () => {
        setSubmitError(null)
        try {
            await createPost.mutateAsync({ title: title.trim(), body: body.trim() })
            handleClose()
        } catch (err) {
            setSubmitError(parseApiError(err))
        }
    }

    const handleDelete = (id) => {
        deletePost.mutate(id)
    }

    const titleOver = title.length > TITLE_MAX
    const bodyOver = body.length > BODY_MAX
    const canSubmit = title.trim() && body.trim() && !titleOver && !bodyOver && !createPost.isPending

    if (error)
        return <Alert severity="error">Error loading posts: {String(error.message ?? error)}</Alert>

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography variant="h5">Posts</Typography>
                {user?.isAdmin && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                        New Post
                    </Button>
                )}
            </div>

            <Grid container spacing={3}>
                {isLoading
                    ? [1, 2, 3, 4].map((n) => (
                        <Grid item xs={12} sm={6} md={4} key={n}>
                            <Card>
                                <CardContent>
                                    <Skeleton width="80%" height={24} />
                                    <Skeleton width="100%" />
                                    <Skeleton width="90%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                    : data?.slice(0, 12).map((post) => (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <Card className="h-full" sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" className="font-semibold mb-2">{post.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{post.body}</Typography>
                                </CardContent>
                                {user?.isAdmin && (
                                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                                        <Tooltip title="Delete post">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deletePost.isPending}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                )}
                            </Card>
                        </Grid>
                    ))}
            </Grid>

            <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>New Post</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    {submitError && (
                        <Alert severity="error">{submitError}</Alert>
                    )}
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setSubmitError(null) }}
                        fullWidth
                        autoFocus
                        error={titleOver}
                        helperText={
                            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {title.length}/{TITLE_MAX}
                            </span>
                        }
                    />
                    <TextField
                        label="Body"
                        value={body}
                        onChange={(e) => { setBody(e.target.value); setSubmitError(null) }}
                        multiline
                        rows={8}
                        fullWidth
                        error={bodyOver}
                        helperText={
                            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {body.length}/{BODY_MAX}
                            </span>
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={!canSubmit}
                    >
                        {createPost.isPending ? 'Creating…' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
