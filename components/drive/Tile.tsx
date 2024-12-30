'use client'
import CodeIcon from '@mui/icons-material/Code'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import FolderIcon from '@mui/icons-material/Folder'
import FolderZipIcon from '@mui/icons-material/FolderZip'
import ImageIcon from '@mui/icons-material/Image'
import InfoIcon from '@mui/icons-material/Info'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import MovieIcon from '@mui/icons-material/Movie'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import PieChartIcon from '@mui/icons-material/PieChart'
import TableViewIcon from '@mui/icons-material/TableView'
import TuneIcon from '@mui/icons-material/Tune'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { useState } from 'react'

type TileProps = {
  name: string
  type:
    | 'folder'
    | 'pdf'
    | 'image'
    | 'video'
    | 'code'
    | 'file'
    | 'text'
    | 'audio'
    | 'spreadsheet'
    | 'archive'
    | 'presentation'
    | 'tab'
}

const getIcon = (type: string) => {
  switch (type) {
    case 'folder':
      return <FolderIcon sx={{ fontSize: 50, color: 'primary.main' }} />
    case 'pdf':
      return <PictureAsPdfIcon sx={{ fontSize: 50, color: 'error.main' }} />
    case 'image':
      return <ImageIcon sx={{ fontSize: 50, color: 'success.main' }} />
    case 'video':
      return <MovieIcon sx={{ fontSize: 50, color: 'secondary.main' }} />
    case 'code':
      return <CodeIcon sx={{ fontSize: 50, color: 'info.main' }} />
    case 'text':
      return <DescriptionIcon sx={{ fontSize: 50, color: 'text.secondary' }} />
    case 'audio':
      return <MusicNoteIcon sx={{ fontSize: 50, color: 'warning.main' }} />
    case 'spreadsheet':
      return <TableViewIcon sx={{ fontSize: 50, color: 'success.dark' }} />
    case 'archive':
      return <FolderZipIcon sx={{ fontSize: 50, color: 'text.primary' }} />
    case 'presentation':
      return <PieChartIcon sx={{ fontSize: 50, color: 'secondary.dark' }} />
    case 'tab':
      return <TuneIcon sx={{ fontSize: 50, color: 'info.main' }} />
    default:
      return (
        <InsertDriveFileIcon sx={{ fontSize: 50, color: 'text.secondary' }} />
      )
  }
}

export function Tile({ name, type }: TileProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setMousePosition({ x: event.clientX, y: event.clientY })
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <Card
      sx={{ maxWidth: 200 }}
      onContextMenu={handleContextMenu}
      elevation={2}
    >
      <CardActionArea>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}
        >
          {getIcon(type)}
        </Box>
        <CardContent>
          <Typography variant="body1" align="center" noWrap>
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Menu
        anchorReference="anchorPosition"
        anchorPosition={
          anchorEl ? { top: mousePosition.y, left: mousePosition.x } : undefined
        }
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu}>
          <DownloadIcon sx={{ mr: 2 }} />
          Download
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseMenu}>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
        <MenuItem onClick={handleCloseMenu}>
          <EditIcon sx={{ mr: 2 }} />
          Rename
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseMenu}>
          <InfoIcon sx={{ mr: 2 }} />
          Details
        </MenuItem>
      </Menu>
    </Card>
  )
}
