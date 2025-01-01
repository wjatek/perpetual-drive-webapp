'use client'
import { Directory } from '@/types/models'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FolderIcon from '@mui/icons-material/Folder'
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
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type DirectoryTileProps = {
  directory: Directory
}

export function DirectoryTile({ directory }: DirectoryTileProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    setMousePosition({ x: event.clientX, y: event.clientY })
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleClick = () => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('id', directory.id)
    router.push(`?${newParams.toString()}`)
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
          <FolderIcon sx={{ fontSize: 50, color: 'primary.main' }} />
        </Box>
        <CardContent>
          <Typography fontSize={14} align="center" fontWeight="bolder" noWrap>
            {directory.name}
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
