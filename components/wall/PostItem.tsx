'use client'
import { toggleLike } from '@/redux/slices/postsSlice'
import { fetchUser } from '@/redux/slices/usersSlice'
import { Dispatch, RootState } from '@/redux/store'
import { Post } from '@/types/models'
import { getInitials } from '@/utils/textUtils'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import { format, formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentList from './CommentList'

type PostItemProps = {
  post: Post
}

export default function PostItem({ post }: PostItemProps) {
  const [likeSubmitting, setLikeSubmitting] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [relativeDate, setRelativeDate] = useState<string>('')
  const dispatch = useDispatch<Dispatch>()
  const currentUser = useSelector((state: RootState) => state.auth.user)

  const { commentsByPostId, loading: commentsLoading } = useSelector(
    (state: RootState) => state.comments
  )

  const { usersById, loading: userLoading } = useSelector(
    (state: RootState) => state.users
  )

  useEffect(() => {
    if (!usersById[post.authorId] && !userLoading[post.authorId]) {
      dispatch(fetchUser(post.authorId))
    }
  }, [dispatch, post.authorId, userLoading, usersById])

  useEffect(() => {
    if (post && currentUser) {
      const isLiked = post.likedBy?.some((user) => user.id === currentUser.id)
      setHasLiked(!!isLiked)
    }
  }, [post, currentUser])

  const getUsername = (userId: string): string | undefined => {
    if (userLoading[userId]) return
    return usersById[userId]?.name || 'Unknown User'
  }

  const fullDate = format(post.createdAt, 'yyyy-MM-dd HH:mm:ss')

  useEffect(() => {
    setRelativeDate(formatDistanceToNow(post.createdAt, { addSuffix: true }))

    const intervalId = setInterval(() => {
      setRelativeDate(formatDistanceToNow(post.createdAt, { addSuffix: true }))
    }, 60000)

    return () => clearInterval(intervalId)
  }, [post.createdAt])

  const handleLikeClick = async () => {
    setLikeSubmitting(true)

    try {
      const resultAction = await dispatch(toggleLike({ id: post.id }))
      unwrapResult(resultAction)
    } catch (error) {
      console.error('Error liking post: ', error)
    } finally {
      setLikeSubmitting(false)
    }
  }

  const handleCommentsClick = () => {
    setCommentsOpen((prevOpen) => !prevOpen)
  }

  return (
    <Card sx={{ maxWidth: 800, margin: '16px auto', boxShadow: 3 }}>
      <CardHeader
        avatar={
          getUsername(post.authorId) ? (
            <Avatar
              src={undefined /** TODO */}
              alt={getUsername(post.authorId)}
            >
              {getInitials(getUsername(post.authorId))}
            </Avatar>
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={getUsername(post.authorId) || <Skeleton width={100} />}
        subheader={
          <Tooltip title={fullDate} placement="right">
            <span>{relativeDate}</span>
          </Tooltip>
        }
      />

      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {post.content}
        </Typography>
      </CardContent>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton onClick={handleLikeClick} disabled={likeSubmitting}>
            {hasLiked || likeSubmitting ? (
              <FavoriteIcon
                fontSize="small"
                sx={{
                  color: hasLiked && !likeSubmitting ? 'red' : 'text.secondary',
                }}
              />
            ) : (
              <FavoriteBorderIcon
                fontSize="small"
                sx={{
                  color: 'text.secondary',
                }}
              />
            )}
          </IconButton>
          <Typography variant="body2">{post.likedBy?.length || 0}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="body2">
            {commentsLoading[post.id] ? (
              <Skeleton width={10} />
            ) : (
              commentsByPostId[post.id]?.length
            )}
          </Typography>
          <IconButton onClick={handleCommentsClick}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Collapse in={commentsOpen} sx={{ px: 2 }}>
        <CommentList postId={post.id} />
      </Collapse>
    </Card>
  )
}
