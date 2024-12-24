'use client'
import { Comment } from '@/app/store/models'
import { Dispatch, RootState } from '@/app/store/store'
import { fetchUser } from '@/app/store/usersSlice'
import { Box, Divider, Skeleton, Tooltip, Typography } from '@mui/material'
import { format, formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type CommentItemProps = {
  comment: Comment
}

export default function CommentItem({ comment }: CommentItemProps) {
  const [relativeDate, setRelativeDate] = useState<string>('')
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

  const fullDate = format(comment.createdAt, 'yyyy-MM-dd HH:mm:ss')

  useEffect(() => {
    setRelativeDate(
      formatDistanceToNow(comment.createdAt, {
        addSuffix: true,
      })
    )

    const intervalId = setInterval(() => {
      setRelativeDate(
        formatDistanceToNow(comment.createdAt, {
          addSuffix: true,
        })
      )
    }, 60000)

    return () => clearInterval(intervalId)
  }, [comment.createdAt])

  return (
    <Box sx={{ mb: 1 }}>
      <Divider />
      <Box
        sx={{ display: 'flex', alignItems: 'center', gap: 1, paddingTop: 1 }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {getUsername(comment.authorId) || <Skeleton width={100} />}
        </Typography>
        <Tooltip title={fullDate} placement="right">
          <Typography color="text.secondary" fontSize={12}>
            {relativeDate}
          </Typography>
        </Tooltip>
      </Box>
      <Typography variant="body2">{comment.content}</Typography>
    </Box>
  )
}
