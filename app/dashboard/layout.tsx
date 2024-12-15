'use client'

import FolderIcon from '@mui/icons-material/Folder'
import HomeIcon from '@mui/icons-material/Home'
import MenuIcon from '@mui/icons-material/Menu'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

const drawerWidth = 240

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          >
            <ListItem
              component="a"
              href={`/dashboard`}
              sx={{
                '&:hover': { backgroundColor: 'primary.light', color: 'white' },
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: 'text.primary' }} primary="Home" />
            </ListItem>

            <ListItem
              component="a"
              href={`/dashboard/wall`}
              sx={{
                '&:hover': { backgroundColor: 'primary.light', color: 'white' },
              }}
            >
              <ListItemIcon>
                <SpeakerNotesIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: 'text.primary' }} primary="Wall" />
            </ListItem>

            <ListItem
              component="a"
              href={`/dashboard/drive`}
              sx={{
                '&:hover': { backgroundColor: 'primary.light', color: 'white' },
              }}
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText sx={{ color: 'text.primary' }} primary="Drive" />
            </ListItem>
          </List>
        </Drawer>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Toolbar
            sx={{
              position: isMobile ? 'fixed' : 'sticky',
              top: 0,
              width: '100%',
              zIndex: 1,
            }}
          >
            {isMobile && (
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }} />
          </Toolbar>

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
