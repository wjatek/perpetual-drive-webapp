'use client'
import { Post } from '@/types/models'
import { Refresh } from '@mui/icons-material'
import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, fetchPosts } from '../../redux/slices/postsSlice'
import { Dispatch, RootState } from '../../redux/store'
import PostItem from './PostItem'

export default function PostList() {
  const dispatch = useDispatch<Dispatch>()
  const {
    list: posts,
    status,
    error,
  } = useSelector((state: RootState) => state.posts)

  const [newPostContent, setNewPostContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts())
    }
  }, [dispatch, status])

  const handleNewPostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPostContent(event.target.value)
  }

  const handleCreatePost = async () => {
    if (newPostContent.trim()) {
      setIsSubmitting(true)

      try {
        const resultAction = await dispatch(
          createPost({ content: newPostContent })
        )
        unwrapResult(resultAction)
        setNewPostContent('')
      } catch (error) {
        console.error('Error adding post: ', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleRefreshClick = () => {
    dispatch(fetchPosts())
  }

  return (
    <Box sx={{ margin: '16px auto', maxWidth: 800 }}>
      <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          label="Write a new post"
          variant="outlined"
          value={newPostContent}
          onChange={handleNewPostChange}
          multiline
        />
        <IconButton
          onClick={handleCreatePost}
          disabled={!newPostContent.trim() || isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : <SendIcon />}
        </IconButton>
      </Box>
      <Divider sx={{ paddingY: 1 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 1,
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
        Array.from({ length: posts.length || 1 }).map((_, index) => (
          <Skeleton
            variant="rounded"
            height={180}
            sx={{ marginY: 2 }}
            key={index}
          />
        ))}
      {status === 'failed' && (
        <Typography color="text.secondary">Error: {error}</Typography>
      )}
      {status === 'succeeded' &&
        posts.map((post: Post) => <PostItem post={post} key={post.id} />)}
    </Box>
  )
}
