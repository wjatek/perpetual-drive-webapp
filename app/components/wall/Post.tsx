'use client'

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SendIcon from '@mui/icons-material/Send'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { format, formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

type PostProps = {
  avatar: string
  username: string
  content: string
  createdAt: Date
  likes: number
  comments: number
}

const getInitials = (username: string): string | undefined => {
  const splitted = username.split(' ')
  if (!splitted) return
  return splitted.length > 1
    ? splitted[0].charAt(0).toUpperCase() +
        splitted.pop()?.charAt(0).toUpperCase()
    : username.charAt(0).toUpperCase()
}

export default function Post({
  avatar,
  username,
  content,
  createdAt,
  likes,
  comments,
}: PostProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)
  const [commentText, setCommentText] = useState('')
  const [commentList, setCommentList] = useState<string[]>([])

  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true })
  const fullDate = format(createdAt, 'yyyy-MM-dd HH:mm:ss')

  const handleLikeClick = () => {
    setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1))
    setLiked((prevLiked) => !prevLiked)
  }

  const handleCommentsClick = () => {}

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(event.target.value)
  }

  const handleAddComment = () => {
    if (commentText.trim()) {
      setCommentList([...commentList, commentText])
      setCommentText('') // Reset comment input field
    }
  }

  return (
    <Card sx={{ maxWidth: 800, margin: '16px auto', boxShadow: 3 }}>
      <CardHeader
        avatar={
          <Avatar src={avatar} alt={username}>
            {getInitials(username)}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        title={username}
        subheader={
          <Tooltip title={fullDate}>
            <span>{relativeTime}</span>
          </Tooltip>
        }
      />

      <CardContent>
        <Typography variant="body1">{content}</Typography>
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
          <IconButton onClick={handleCommentsClick}>
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2">{comments}</Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 1 }}>
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
          {commentList.map((comment, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {username}
              </Typography>
              <Typography variant="body2">{comment}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  )
}
