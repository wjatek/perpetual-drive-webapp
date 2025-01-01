'use client'
import ProgressBar from '@/components/common/ProgressBar'
import api from '@/lib/api'
import {
  createDirectory,
  fetchDirectories,
} from '@/redux/slices/directoriesSlice'
import { fetchFiles } from '@/redux/slices/filesSlice'
import { Dispatch, RootState } from '@/redux/store'
import { Directory } from '@/types/models'
import { CreateNewFolder, Refresh, Upload } from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Breadcrumbs,
  CircularProgress,
  Grid2,
  IconButton,
  Link,
  Skeleton,
  Typography,
} from '@mui/material'
import { unwrapResult } from '@reduxjs/toolkit'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Prompt from '../common/Prompt'
import { DirectoryTile } from './DirectoryTile'
import { FileTile } from './FileTile'
import { LoadingTile } from './LoadingTile'

export default function DirectoryView() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [newDirectoryPromptOpen, setNewDirectoryPromptOpen] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<Dispatch>()
  const {
    directoriesByParentId,
    directoryPath,
    loading: loadingDirectories,
    error: directoriesError,
    addDirectoryStatus,
  } = useSelector((state: RootState) => state.directories)
  const {
    filesByDirectoryId,
    loading: loadingFiles,
    error: filesError,
  } = useSelector((state: RootState) => state.files)

  const directoryId = searchParams.get('id') || ''
  useEffect(() => {
    if (
      !directoriesByParentId[directoryId] &&
      !loadingDirectories[directoryId] &&
      !filesByDirectoryId[directoryId] &&
      !loadingFiles[directoryId]
    ) {
      loadContent(directoryId)
    }
  }, [directoryId])

  const loadContent = async (directoryId: string) => {
    if (!loadingDirectories[directoryId]) {
      dispatch(fetchDirectories(directoryId))
    }
    if (!loadingFiles[directoryId]) {
      dispatch(fetchFiles(directoryId))
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files ? event.target.files[0] : null

    if (selectedFile) {
      setFile(selectedFile)
      setUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('directoryId', directoryId)

      try {
        setUploadProgress(0)
        const response = await api.post('/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.floor(
                (progressEvent.loaded / progressEvent.total) * 100
              )
              setUploadProgress(percent)
            }
          },
        })

        console.log('File uploaded successfully:', response.data)
        loadContent(directoryId)
      } catch (error) {
        console.error('Error uploading file:', error)
      } finally {
        setUploading(false)
        setUploadProgress(0)
        setFile(null)
      }
    }
  }

  const handleRefreshClick = () => {
    loadContent(directoryId)
  }

  const handleNewDirectoryClick = () => {
    setNewDirectoryPromptOpen(true)
  }

  const handleCreateDirectory = async (value: string) => {
    if (value.trim()) {
      try {
        const resultAction = await dispatch(
          createDirectory({
            name: value,
            parentId: directoryId,
          })
        )
        const result = unwrapResult(resultAction)
      } catch (error) {
        console.error('Error adding directory: ', error)
      } finally {
        loadContent(directoryId)
      }
    }
  }

  const handleCrumbClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault()
    if (id !== directoryId) router.push(`?id=${id}`)
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        mt: 0,
        pb: 2,
      }}
    >
      <Grid2
        container
        spacing={2}
        sx={{
          px: { xs: 2, sm: 4 },
        }}
      >
        <Grid2 size={{ xs: 12 }}>
          <IconButton
            onClick={handleRefreshClick}
            disabled={
              loadingDirectories[directoryId] || loadingFiles[directoryId]
            }
          >
            <Refresh fontSize="small" />
          </IconButton>

          <IconButton
            onClick={handleNewDirectoryClick}
            disabled={
              loadingDirectories[directoryId] || loadingFiles[directoryId]
            }
          >
            <CreateNewFolder fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() => document.getElementById('fileInput')?.click()}
            disabled={
              loadingDirectories[directoryId] ||
              loadingFiles[directoryId] ||
              uploading
            }
          >
            <Upload fontSize="small" />
          </IconButton>

          {uploading && (
            <Box display="inline-block" px={1}>
              <Box display="flex" alignItems="center">
                <Typography color="text.secondary" fontSize={14}>
                  {file?.name}
                </Typography>
                <Box maxWidth={200} pl={1}>
                  <ProgressBar value={uploadProgress} sx={{ height: 7 }} />
                </Box>
              </Box>
            </Box>
          )}
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Breadcrumbs>
            {directoryPath[directoryId] ? (
              [
                { name: 'Drive', id: '' } as Pick<Directory, 'id' | 'name'>,
                ...directoryPath[directoryId],
              ].map((crumb) => (
                <Link
                  href={`?id=${crumb.id}`}
                  underline="hover"
                  color={crumb.id !== directoryId ? 'inherit' : 'text.primary'}
                  key={crumb.id}
                  onClick={(e) => handleCrumbClick(e, crumb.id)}
                >
                  {crumb.name}
                </Link>
              ))
            ) : (
              <Skeleton height={14} width={100} />
            )}
          </Breadcrumbs>
        </Grid2>
      </Grid2>

      <Grid2
        container
        spacing={2}
        sx={{
          px: { xs: 2, sm: 4 },
          py: { xs: 4, sm: 2 },
          position: 'relative',
        }}
      >
        {directoriesByParentId[directoryId]?.map((directory) => (
          <Grid2 size={{ xs: 6, md: 3, lg: 2 }} key={directory.id}>
            <DirectoryTile directory={directory} />
          </Grid2>
        ))}
        {filesByDirectoryId[directoryId]?.map((file) => (
          <Grid2 size={{ xs: 6, md: 3, lg: 2 }} key={file.id}>
            <FileTile file={file} />
          </Grid2>
        ))}

        {(loadingDirectories[directoryId] || loadingFiles[directoryId]) &&
          (!directoriesByParentId[directoryId] ||
            !filesByDirectoryId[directoryId]) && <LoadingTile />}

        <Backdrop
          sx={(theme) => ({
            color: 'text.primary',
            zIndex: theme.zIndex.drawer - 1,
            background: 'none',
            backdropFilter: 'blur(4px)',
            position: 'absolute',
          })}
          transitionDuration={200}
          open={
            loadingDirectories[directoryId] ||
            loadingFiles[directoryId] ||
            addDirectoryStatus.loading
          }
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid2>

      <Prompt
        text="Directory name"
        open={newDirectoryPromptOpen}
        onClose={() => setNewDirectoryPromptOpen(false)}
        onSubmit={(value) => handleCreateDirectory(value)}
      />

      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
    </Box>
  )
}
