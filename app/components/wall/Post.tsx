import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { format, formatDistanceToNow } from 'date-fns'

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
  const relativeTime = formatDistanceToNow(createdAt, { addSuffix: true })
  const fullDate = format(createdAt, 'yyyy-MM-dd HH:mm:ss')

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
          <FavoriteBorderIcon fontSize="small" />
          <Typography variant="body2">{likes}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography variant="body2">{comments}</Typography>
        </Box>
      </Box>
    </Card>
  )
}
