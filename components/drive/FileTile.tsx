'use client'
import api from '@/lib/api'
import { File } from '@/types/models'
import { getIcon, resolveFileType } from '@/utils/fileUtils'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { relative } from 'path'
import { useState } from 'react'

type FileTileProps = {
  file: File
}

export function FileTile({ file }: FileTileProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloading, setDownloading] = useState(false)

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setMousePosition({ x: event.clientX, y: event.clientY })
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClick = () => {}

  const handleDownload = async () => {
    try {
      setDownloading(true)
      handleCloseMenu()
      const response = await api.get(`/files/download/${file.id}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total
          const loaded = progressEvent.loaded
          if (total) {
            const percent = Math.round((loaded / total) * 100)
            setDownloadProgress(percent)
          }
        },
      })

      const fileName = file.name

      const blob = response.data
      const link = document.createElement('a')
      const url = window.URL.createObjectURL(blob)
      link.href = url
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading file:', error)
    } finally {
      setDownloadProgress(0)
      setDownloading(false)
    }
  }

  return (
    <Card
      sx={{ maxWidth: 200 }}
      onContextMenu={handleContextMenu}
      elevation={2}
    >
      <CardActionArea onClick={handleClick}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}
        >
          <Box position="relative">
            {getIcon(resolveFileType(file.name))}
            {downloading && (
              <CircularProgress
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-90deg) !important',
                }}
                size={70}
                variant="determinate"
                value={downloadProgress}
              />
            )}
          </Box>
        </Box>
        <CardContent>
          <Typography fontSize={14} align="center" noWrap>
            {file.name}
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
        <MenuItem onClick={handleDownload}>
          <DownloadIcon sx={{ mr: 2 }} />
          Download
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseMenu} disabled>
          <DeleteIcon sx={{ mr: 2 }} />
          Delete
        </MenuItem>
        <MenuItem onClick={handleCloseMenu} disabled>
          <EditIcon sx={{ mr: 2 }} />
          Rename
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseMenu} disabled>
          <InfoIcon sx={{ mr: 2 }} />
          Details
        </MenuItem>
      </Menu>
    </Card>
  )
}
