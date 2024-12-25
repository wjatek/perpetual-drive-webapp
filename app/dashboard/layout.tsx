'use client'
import MenuIcon from '@mui/icons-material/Menu'
import {
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DrawerMenu from '../components/ui/DrawerMenu'
import { ThemeToggleButton } from '../components/ui/ThemeToggleButton'
import UserActions from '../components/ui/UserActions'
import { RootState } from '../store/store'
import { Dispatch } from '@/app/store/store';
import { refreshAccessToken } from '../store/authSlice'

const drawerWidth = 240

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()
  const currentRoute = usePathname()
  const dispatch = useDispatch<Dispatch>()
  const { isAuthenticated, token, user, loading } = useSelector(
    (state: RootState) => state.auth
  )

  const autoLogin = async () => {
    if (!isAuthenticated || !token || !user) {
      try {
        await dispatch(refreshAccessToken()).unwrap()
      } catch (error) {
        router.replace(`/login?backTo=${currentRoute}`)
      }
    }
  }

  useEffect(() => {
    if (!loading && (!isAuthenticated || !token || !user)) {
      autoLogin()
    }
  }, [])

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen)
  }

  if (!isAuthenticated)
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: 999999 }}
        open={true}
        transitionDuration={{
          appear: 0,
          enter: 0,
          exit: 500,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    )

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
          <Toolbar />
          <Toolbar
            sx={(theme) => ({
              position: 'fixed',
              top: 0,
              right: 0,
              left: 0,
              backgroundColor: 'background.default',
              zIndex: theme.zIndex.drawer - 1,
            })}
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
            <ThemeToggleButton />
            <UserActions />
          </Toolbar>

          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
