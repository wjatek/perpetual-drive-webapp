'use client'
import { fetchDirectories } from '@/redux/slices/directoriesSlice'
import { fetchFiles } from '@/redux/slices/filesSlice'
import { Dispatch, RootState } from '@/redux/store'
import { Directory } from '@/types/models'
import { Refresh } from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Breadcrumbs,
  CircularProgress,
  Grid2,
  IconButton,
  Link,
  Skeleton,
} from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DirectoryTile } from './DirectoryTile'
import { FileTile } from './FileTile'
import { LoadingTile } from './LoadingTile'

export default function DirectoryView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch<Dispatch>()
  const {
    directoriesByParentId,
    directoryPath,
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
            onClick={handleRefreshClick}
            disabled={
              loadingDirectories[directoryId] || loadingFiles[directoryId]
            }
          >
            <Refresh fontSize="small" />
          </IconButton>
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
