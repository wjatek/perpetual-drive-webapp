'use client'

import { Post } from '@/app/store/models'
import { Box, Skeleton, Typography } from '@mui/material'
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

  if (status === 'loading') {
    return (
      <Box sx={{ margin: '16px auto', maxWidth: 800 }}>
        <Skeleton variant="rounded" height={180} />
      </Box>
    )
  }

  if (status === 'failed') {
    return (
      <Box sx={{ margin: '16px auto', maxWidth: 800 }}>
        <Typography color="text.secondary">Error: {error}</Typography>
      </Box>
    )
  }

  return (
    <Box>
      {posts.map((post: Post) => (
        <PostItem post={post} key={post.id} />
      ))}
    </Box>
  )
}
