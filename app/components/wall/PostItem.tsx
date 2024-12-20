'use client'

import { Post } from '@/app/store/models'
import { Dispatch, RootState } from '@/app/store/store'
import { fetchUser } from '@/app/store/usersSlice'
import { getInitials } from '@/app/utils/textUtils'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
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
import { format, formatDistanceToNow } from 'date-fns'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentList from './CommentList'

type PostItemProps = {
  post: Post
}

export default function PostItem({ post }: PostItemProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likedBy?.length || 0)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const dispatch = useDispatch<Dispatch>()

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
  }, [dispatch])

  const getUsername = (userId: string): string | undefined => {
    if (userLoading[userId]) return
    return usersById[userId]?.name || 'Unknown User'
  }

  const relativeTime = formatDistanceToNow(post.createdAt, { addSuffix: true })
  const fullDate = format(post.createdAt, 'yyyy-MM-dd HH:mm:ss')

  const handleLikeClick = () => {
    setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1))
    setLiked((prevLiked) => !prevLiked)
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
          <Tooltip title={fullDate}>
            <span>{relativeTime}</span>
          </Tooltip>
        }
      />

      <CardContent>
        <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-line' }}>{post.content}</Typography>
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
          <IconButton onClick={handleLikeClick}>
            <FavoriteBorderIcon
              fontSize="small"
              sx={{
                color: liked ? 'red' : 'text.secondary',
              }}
            />
          </IconButton>
          <Typography variant="body2">{likesCount}</Typography>
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
