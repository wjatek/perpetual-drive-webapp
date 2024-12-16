import { Tile } from '@/app/components/drive/Tile'
import { Box, Grid2 } from '@mui/material'

const items: {
  id: string
  name: string
  type: 'folder' | 'pdf' | 'image' | 'video' | 'code' | 'file'
}[] = [
  { id: '1', name: 'Documents', type: 'folder' },
  { id: '2', name: 'Music', type: 'folder' },
  { id: '3', name: 'Report.pdf', type: 'pdf' },
  { id: '4', name: 'Video.mp4', type: 'video' },
  { id: '5', name: 'Image.jpg', type: 'image' },
  { id: '6', name: 'Script.js', type: 'code' },
]

export default function DrivePage() {
  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100vh',
        py: { xs: 2, sm: 4 },
      }}
    >
      <Grid2
        container
        spacing={2}
        sx={{
          px: { xs: 2, sm: 4 },
        }}
      >
        {items.map((item) => (
          <Grid2 size={{ xs: 6, md: 3, lg: 2 }} key={item.id}>
            <Tile name={item.name} type={item.type} />
          </Grid2>
        ))}
      </Grid2>
    </Box>
  )
}
