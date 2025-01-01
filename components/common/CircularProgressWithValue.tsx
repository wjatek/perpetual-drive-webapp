import {
  Box,
  CircularProgress,
  CircularProgressProps,
  Typography,
  TypographyProps,
} from '@mui/material'

type CircularProgressWithValueProps = {
  value?: number
  progressConfig?: CircularProgressProps
  textConfig?: TypographyProps
}

export default function CircularProgressWithValue({
  value,
  progressConfig,
  textConfig,
}: CircularProgressWithValueProps) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={value || 0}
        {...progressConfig}
      />
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
        }}
      >
        <Typography
          variant="caption"
          component="div"
          {...textConfig}
        >{`${Math.round(value || 0)}%`}</Typography>
      </Box>
    </Box>
  )
}
