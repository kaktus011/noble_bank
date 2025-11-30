import React from 'react'
import { usePosts } from '../hooks/usePosts'
import { Grid, Card, CardContent, Typography, Skeleton, Alert } from '@mui/material'

export default function Posts() {
  const { data, isLoading, error } = usePosts()

  if (error) return <Alert severity="error">Error loading posts: {String(error.message ?? error)}</Alert>

  return (
    <div>
      <Typography variant="h5" className="mb-4">Posts</Typography>
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
          : data.slice(0, 12).map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <Card className="h-full">
                  <CardContent>
                    <Typography variant="subtitle1" className="font-semibold mb-2">{post.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{post.body}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>
    </div>
  )
}
