'use client'
import CircularProgressWithValue from '@/components/common/CircularProgressWithValue'
import { usePopup } from '@/hooks/usePopup'
import api from '@/lib/api'
import {
  setFileDownloading,
  setFileDownloadingProgress,
} from '@/redux/slices/filesSlice'
import { Dispatch, RootState } from '@/redux/store'
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
  Divider,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type FileTileProps = {
  file: File
}

export function FileTile({ file }: FileTileProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const dispatch = useDispatch<Dispatch>()
  const { fileDownloading, fileDownloadingProgress } = useSelector(
    (state: RootState) => state.files
  )
  const showPopup = usePopup()

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setMousePosition({ x: event.clientX, y: event.clientY })
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClick = async () => {
    // TODO - for popup system testing only
    console.log()
    const selectedOption = await showPopup({
      title: 'Popup',
      message: 'Files preview is not implementet yet',
      options: [
        { value: true, text: 'OK' },
        { value: false, text: 'Cancel' },
      ],
      closeable: false,
    })
    console.log('[Popup] Selected option:', selectedOption)
  }

  const handleDownload = async () => {
    try {
      dispatch(setFileDownloading({ id: file.id, isDownloading: true }))
      dispatch(setFileDownloadingProgress({ id: file.id, value: 0 }))
      handleCloseMenu()
      const response = await api.get(`/files/download/${file.id}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total
          const loaded = progressEvent.loaded
          if (total) {
            const percent = Math.round((loaded / total) * 100)
            dispatch(
              setFileDownloadingProgress({ id: file.id, value: percent })
            )
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
      dispatch(setFileDownloadingProgress({ id: file.id, value: 0 }))
      dispatch(setFileDownloading({ id: file.id, isDownloading: false }))
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
            {fileDownloading[file.id] && (
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(3px)',
                }}
              >
                <CircularProgressWithValue
                  progressConfig={{ size: 70 }}
                  textConfig={{
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}
                  value={fileDownloadingProgress[file.id]}
                />
              </Box>
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
        <MenuItem onClick={handleDownload} disabled={fileDownloading[file.id]}>
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
