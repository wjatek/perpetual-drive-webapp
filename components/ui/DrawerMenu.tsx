import FolderIcon from '@mui/icons-material/Folder'
import HomeIcon from '@mui/icons-material/Home'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { text: 'Home', url: '/dashboard', icon: <HomeIcon /> },
  { text: 'Wall', url: '/dashboard/wall', icon: <SpeakerNotesIcon /> },
  { text: 'Drive', url: '/dashboard/drive', icon: <FolderIcon /> },
]

type DrawerMenuProps = {
  onClick: () => void
}

export default function DrawerMenu({ onClick }: DrawerMenuProps) {
  const pathname = usePathname()

  return (
    <List sx={{ width: '100%' }}>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            selected={pathname === item.url}
            LinkComponent={Link}
            onClick={onClick}
            href={item.url}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
