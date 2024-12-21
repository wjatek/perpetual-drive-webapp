'use client'
import { Comment } from '@/app/store/models'
import { Dispatch, RootState } from '@/app/store/store'
import { fetchUser } from '@/app/store/usersSlice'
import { Box, Divider, Skeleton, Typography } from '@mui/material'
import { format, formatDistanceToNow } from 'date-fns'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type CommentItemProps = {
  comment: Comment
}

export default function CommentItem({ comment }: CommentItemProps) {
  const dispatch = useDispatch<Dispatch>()

  const { usersById, loading: userLoading } = useSelector(
    (state: RootState) => state.users
  )

  useEffect(() => {
    if (!usersById[comment.authorId] && !userLoading[comment.authorId]) {
      dispatch(fetchUser(comment.authorId))
    }
  }, [dispatch])

  const getUsername = (userId: string): string | undefined => {
    if (userLoading[userId]) return
    return usersById[userId]?.name || 'Unknown User'
  }

  const relativeTime = formatDistanceToNow(comment.createdAt, {
    addSuffix: true,
  })
  const fullDate = format(comment.createdAt, 'yyyy-MM-dd HH:mm:ss')

  return (
    <Box sx={{ mb: 1 }}>
      <Divider />
      <Typography variant="body2" sx={{ fontWeight: 'bold' }} paddingTop={1}>
        {getUsername(comment.authorId) || <Skeleton width={100} />}
      </Typography>
      <Typography variant="body2">{comment.content}</Typography>
    </Box>
  )
}
