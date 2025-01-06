'use client'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  TextFieldProps,
} from '@mui/material'
import {
  KeyboardEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'

type PromptConfig = {
  text: string
  inputConfig?: TextFieldProps
}

type PromptContextType = {
  showPrompt: (config: PromptConfig) => Promise<string | null>
}

const PromptContext = createContext<PromptContextType | undefined>(undefined)

export function PromptProvider({ children }: { children: ReactNode }) {
  const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null)
  const [resolveCallback, setResolveCallback] = useState<
    ((value: string | null) => void) | null
  >(null)
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState('')
  const textFieldRef = useRef<HTMLInputElement | null>(null)

  const showPrompt = useCallback((config: PromptConfig) => {
    return new Promise<string | null>((resolve) => {
      setPromptConfig(config)
      setResolveCallback(() => resolve)
      setIsOpen(true)
    })
  }, [])

  const handleClose = () => {
    if (resolveCallback) resolveCallback(null)
    setIsOpen(false)
  }

  const handleSubmit = () => {
    if (resolveCallback) resolveCallback(value)
    setIsOpen(false)
  }

  const handleExited = () => {
    setPromptConfig(null)
    setResolveCallback(null)
    setValue('')
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleDialogEntered = () => {
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
  }

  return (
    <PromptContext.Provider value={{ showPrompt }}>
      {children}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        onTransitionEnter={handleDialogEntered}
        onTransitionExited={handleExited}
      >
        <DialogContent>
          <DialogContentText>{promptConfig?.text}</DialogContentText>
          <TextField
            onChange={(e) => setValue(e.target.value)}
            inputRef={textFieldRef}
            onKeyDown={handleKeyDown}
            autoFocus
            required
            autoComplete="off"
            margin="dense"
            fullWidth
            variant="standard"
            {...promptConfig?.inputConfig}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </PromptContext.Provider>
  )
}

export function usePrompt() {
  const context = useContext(PromptContext)
  if (!context) {
    throw new Error('usePrompt must be used within a PromptProvider')
  }
  return context.showPrompt
}
