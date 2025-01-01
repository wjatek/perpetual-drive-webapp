'use client'
import { Box, Card, CardContent, Grid2, Skeleton } from '@mui/material'

export function LoadingTile() {
  return (
    <Grid2 size={{ xs: 6, md: 3, lg: 2 }}>
      <Card sx={{ maxWidth: 200 }} elevation={2}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
          }}
        >
          <Skeleton height={100} width={100} />
        </Box>
        <CardContent>
          <Skeleton height={14} />
        </CardContent>
      </Card>
    </Grid2>
  )
}
