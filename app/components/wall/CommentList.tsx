'use client'

import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  Divider,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComments } from '../../store/commentsSlice'
import { Comment } from '../../store/models'
import { Dispatch, RootState } from '../../store/store'
import CommentItem from './Comment'

interface CommentsProps {
  postId: string
}

export default function CommentList({ postId }: CommentsProps) {
  const [commentText, setCommentText] = useState('')

  const dispatch = useDispatch<Dispatch>()
  const { commentsByPostId, loading, error } = useSelector(
    (state: RootState) => state.comments
  )

  useEffect(() => {
    if (!commentsByPostId[postId] && !loading[postId]) {
      dispatch(fetchComments(postId))
    }
  }, [dispatch])

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value)
  }

  const handleAddComment = () => {
    if (commentText.trim()) {
      setCommentText('')
      /** TODO */
    }
  }

  if (error) {
    return (
      <Typography color="text.secondary">
        Cannot load comments: {error}
      </Typography>
    )
  }

  const comments = commentsByPostId[postId] || []

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          label="Add a comment"
          variant="outlined"
          value={commentText}
          onChange={handleCommentChange}
          sx={{ flexGrow: 1 }}
        />

        <IconButton onClick={handleAddComment} disabled={!commentText.trim()}>
          <SendIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 2 }}>
        {loading[postId] ? (
          <Box>
            <Divider />
            <Skeleton height={60} />
          </Box>
        ) : (
          comments.map((comment: Comment, index) => (
            <CommentItem comment={comment} key={comment.id} />
          ))
        )}
      </Box>
    </Box>
  )
}
