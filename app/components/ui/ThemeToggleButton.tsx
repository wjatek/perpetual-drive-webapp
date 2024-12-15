import { useThemeContext } from '@/app/themeContext'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { IconButton } from '@mui/material'

export const ThemeToggleButton = () => {
  const { toggleTheme, theme } = useThemeContext()

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
    </IconButton>
  )
}
