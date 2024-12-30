'use client'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../../redux/slices/authSlice'
import { Dispatch, RootState } from '../../redux/store'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoginAttempted, setIsLoginAttempted] = useState(false)
  const dispatch = useDispatch<Dispatch>()
  const { error, isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  )
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !password || loading) {
      return
    }

    setLoading(true)
    try {
      const resultAction = await dispatch(loginUser({ name, password }))
      unwrapResult(resultAction)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated && token) {
      const backTo = searchParams.get('backTo')
      if (backTo) {
        router.replace(backTo)
      } else {
        router.replace('/dashboard')
      }
    }
  }, [isAuthenticated, token, router, searchParams])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}
        >
          <Box display="flex" justifyContent="center" alignItems="center">
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
          </Box>
          <TextField
            label="Username"
            type="text"
            variant="outlined"
            fullWidth
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box position="relative">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={(e) => handleSubmit(e)}
              fullWidth
            >
              Login
            </Button>
            <Typography
              position="absolute"
              textAlign="center"
              width="100%"
              color="error.main"
            >
              {error}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
        transitionDuration={{
          appear: 0,
          enter: 0,
          exit: 500,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
