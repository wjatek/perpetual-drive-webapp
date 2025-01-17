'use client'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'

type PopupOption = {
  value: any
  text: string
}

type PopupConfig = {
  title?: string
  message: string
  options: PopupOption[]
  closeable?: boolean
}

type PopupContextType = {
  showPopup: (config: PopupConfig) => Promise<any>
}

const PopupContext = createContext<PopupContextType | undefined>(undefined)

export function PopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null)
  const [resolveCallback, setResolveCallback] = useState<
    ((value: any) => void) | null
  >(null)

  const showPopup = useCallback((config: PopupConfig) => {
    return new Promise<any>((resolve) => {
      setPopupConfig(config)
      setResolveCallback(() => resolve)
      setIsOpen(true)
    })
  }, [])

  const handleOptionClick = (value: any) => {
    if (resolveCallback) resolveCallback(value)
    setResolveCallback(null)
    setIsOpen(false)
  }

  const handleExited = () => {
    setPopupConfig(null)
    setResolveCallback(null)
  }

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      <Dialog
        open={isOpen}
        onClose={
          popupConfig?.closeable ? () => handleOptionClick(null) : undefined
        }
        disableEscapeKeyDown={!popupConfig?.closeable}
        onTransitionExited={handleExited}
      >
        {popupConfig?.title && <DialogTitle>{popupConfig.title}</DialogTitle>}
        <DialogContent>
          <Typography>{popupConfig?.message}</Typography>
        </DialogContent>
        <DialogActions>
          {popupConfig?.options.map((option, index) => (
            <Button key={index} onClick={() => handleOptionClick(option.value)}>
              {option.text}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    </PopupContext.Provider>
  )
}

export function usePopup() {
  const context = useContext(PopupContext)
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider')
  }
  return context.showPopup
}
