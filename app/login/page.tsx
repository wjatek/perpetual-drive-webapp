import { Box, Button, TextField } from '@mui/material'

export default function LoginPage() {
  return (
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
        <TextField label="Email" type="email" variant="outlined" fullWidth />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </Box>
    </Box>
  )
}
