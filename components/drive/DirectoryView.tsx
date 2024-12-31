'use client'
import { fetchDirectories } from '@/redux/slices/directoriesSlice'
import { fetchFiles } from '@/redux/slices/filesSlice'
import { Dispatch, RootState } from '@/redux/store'
import { Refresh } from '@mui/icons-material'
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid2,
  IconButton,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DirectoryTile } from './DirectoryTile'
import { FileTile } from './FileTile'
import { LoadingTile } from './LoadingTile'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const items: {
  id: string
  name: string
  type:
    | 'folder'
    | 'pdf'
    | 'image'
    | 'video'
    | 'code'
    | 'file'
    | 'text'
    | 'audio'
    | 'spreadsheet'
    | 'archive'
    | 'presentation'
    | 'tab'
}[] = [
  { id: '1', name: 'Documents', type: 'folder' },
  { id: '2', name: 'Music', type: 'folder' },
  { id: '3', name: 'Report.pdf', type: 'pdf' },
  { id: '4', name: 'Video.mp4', type: 'video' },
  { id: '5', name: 'Image.jpg', type: 'image' },
  { id: '6', name: 'Script.js', type: 'code' },
  { id: '7', name: 'Notes.txt', type: 'text' },
  { id: '8', name: 'Podcast.mp3', type: 'audio' },
  { id: '9', name: 'FinancialReport.xlsx', type: 'spreadsheet' },
  { id: '10', name: 'Backup.zip', type: 'archive' },
  { id: '11', name: 'Presentation.pptx', type: 'presentation' },
  { id: '12', name: 'Tabs.gp7', type: 'tab' },
]

export default function DirectoryView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<Dispatch>()
  const {
    directoriesByParentId,
    loading: loadingDirectories,
    error: directoriesError,
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
      console.log('loading from useEffect')
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

  const handleRefreshClick = () => {
    loadContent(directoryId)
  }

  const handleBackClick = () => {
    router.back()
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        mt: 0,
        mb: 2,
      }}
    >
      <Grid2
        container
        spacing={2}
        sx={{
          px: { xs: 2, sm: 4 },
          position: 'relative',
        }}
      >
        <Grid2 size={{ xs: 12 }}>
          <IconButton
            onClick={handleBackClick}
            disabled={
              loadingDirectories[directoryId] ||
              loadingFiles[directoryId] ||
              !directoryId
            }
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleRefreshClick}
            disabled={
              loadingDirectories[directoryId] || loadingFiles[directoryId]
            }
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Grid2>

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
          sx={{
            color: '#fff',
            backgroundColor: 'background.default',
            zIndex: 999999,
            position: 'absolute',
          }}
          open={loadingDirectories[directoryId] || loadingFiles[directoryId]}
          transitionDuration={{
            appear: 0,
            enter: 0,
            exit: 100,
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Grid2>
    </Box>
  )
}
