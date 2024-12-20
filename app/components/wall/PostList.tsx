'use client'

import { Post } from '@/app/store/models'
import { Refresh } from '@mui/icons-material'
import { Box, IconButton, Skeleton, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../../store/postsSlice'
import { Dispatch, RootState } from '../../store/store'
import PostItem from './PostItem'

export default function PostList() {
  const dispatch = useDispatch<Dispatch>()
  const {
    list: posts,
    status,
    error,
  } = useSelector((state: RootState) => state.posts)
  const { commentsByPostId, loading: commentsLoading } = useSelector(
    (state: RootState) => state.comments
  )

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts())
    }
  }, [dispatch, status])

  const handleRefreshClick = () => {
    dispatch(fetchPosts())
  }

  return (
    <Box sx={{ margin: '16px auto', maxWidth: 800 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={handleRefreshClick}
          disabled={status === 'loading'}
        >
          <Refresh fontSize="small" />
        </IconButton>
      </Box>
      {status === 'loading' &&
        Array.from({ length: posts.length }).map((_, index) => (
          <Skeleton variant="rounded" height={180} sx={{ marginY: 2 }} key={index} />
        ))}
      {status === 'failed' && (
        <Typography color="text.secondary">Error: {error}</Typography>
      )}
      {status === 'succeeded' &&
        posts.map((post: Post) => <PostItem post={post} key={post.id} />)}
    </Box>
  )
}
