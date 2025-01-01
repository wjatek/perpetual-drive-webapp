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
import { useRef, useState } from 'react'

type PromptProps = {
  text: string
  open: boolean
  onClose: () => void
  onSubmit: (value: string) => void
  inputConfig?: TextFieldProps
}

export default function Prompt({
  text,
  open,
  onClose,
  onSubmit,
  inputConfig,
}: PromptProps) {
  const [value, setValue] = useState('')
  const textFieldRef = useRef<HTMLInputElement | null>(null)

  const handleOkClick = () => {
    onSubmit(value)
    onClose()
  }

  const handleDialogEntered = () => {
    console.log('test')
    if (textFieldRef.current) {
      textFieldRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleOkClick()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} onAnimationEnd={handleDialogEntered}>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
        <TextField
          onChange={(e) => setValue(e.target.value)}
          inputRef={textFieldRef}
          onKeyDown={handleKeyDown}
          autoFocus
          required
          margin="dense"
          fullWidth
          variant="standard"
          {...inputConfig}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="primary" onClick={handleOkClick}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
