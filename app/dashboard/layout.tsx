'use client'

import MenuIcon from '@mui/icons-material/Menu'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Image from 'next/image'
import { useState } from 'react'
import DrawerMenu from '../components/ui/DrawerMenu'
import { ThemeToggleButton } from '../components/ui/ThemeToggleButton'

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
      <Box sx={{ display: 'flex', backgroundColor: '' }}>
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
          <Toolbar>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={36}
                height={36}
                style={{ marginTop: 8 }}
              />
            </Box>
            <Typography variant="h1" fontSize={18} padding={2}>
              Perpetual Drive
            </Typography>
          </Toolbar>
          <Divider />
          <DrawerMenu />
        </Drawer>

        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Toolbar>
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
            <ThemeToggleButton />
          </Toolbar>

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
