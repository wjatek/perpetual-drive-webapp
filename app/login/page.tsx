'use client'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../store/authSlice'
import { Dispatch, RootState } from '../store/store'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch<Dispatch>()
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  )
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !password) {
      return
    }

    dispatch(loginUser({ name, password }))
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

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
          <Box display='flex' justifyContent='center' alignItems='center'>
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
          <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            Login
          </Button>
          <Typography color="error.main">{error}</Typography>
        </Box>
      </Box>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
