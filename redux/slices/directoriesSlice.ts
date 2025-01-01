import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { Directory } from '@/types/models'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface DirectoriesState {
  directoriesByParentId: { [key: string | '']: Directory[] }
  loading: { [key: string | '']: boolean }
  error: string | null
  directoryPath: { [key: string]: Pick<Directory, 'id' | 'name'>[] }
  addDirectoryStatus: {
    loading: boolean
    error: string | null
  }
}

const initialState: DirectoriesState = {
  directoriesByParentId: {},
  loading: {},
  error: null,
  directoryPath: {},
  addDirectoryStatus: {
    loading: false,
    error: null,
  },
}

export const fetchDirectories = createAsyncThunk<
  { directories: Directory[]; path: Pick<Directory, 'id' | 'name'>[] },
  string | null
>('directories/fetchDirectories', async (id) => {
  const [directoriesResponse, pathResponse] = await Promise.all([
    api.get<Directory[]>(`/directories?parentId=${id || ''}`),
    id
      ? api.get<{ path: Pick<Directory, 'id' | 'name'>[] }>(
          `/directories/${id}/path`
        )
      : Promise.resolve({ data: { path: [] } }),
  ])
  return { directories: directoriesResponse.data, path: pathResponse.data.path }
})

export const createDirectory = createAsyncThunk<
  Directory,
  Pick<Directory, 'name' | 'parentId'>
>('directories/createDirectory', async (directory) => {
  const response = await api.post<Directory>('/directories', directory)
  return response.data
})

const directoriesSlice = createSlice({
  name: 'directories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDirectories.pending, (state, action) => {
        const id = action.meta.arg
        state.loading[id || ''] = true
        state.error = null
      })
      .addCase(fetchDirectories.fulfilled, (state, action) => {
        const id = action.meta.arg
        const payload = action.payload
        state.directoriesByParentId[id || ''] = payload.directories
        state.directoryPath[id || ''] = payload.path
        state.loading[id || ''] = false
      })
      .addCase(fetchDirectories.rejected, (state, action) => {
        const id = action.meta.arg
        state.loading[id || ''] = false
        state.error = action.error.message || 'Failed to fetch directories'
      })

      .addCase(createDirectory.pending, (state) => {
        state.addDirectoryStatus.loading = true
        state.addDirectoryStatus.error = null
      })
      .addCase(createDirectory.fulfilled, (state, action) => {
        const directory = action.payload
        if (!state.directoriesByParentId[directory.parentId || ''])
        state.directoriesByParentId[directory.parentId || ''].unshift(directory)
        state.addDirectoryStatus.loading = false
      })
      .addCase(createDirectory.rejected, (state, action) => {
        state.addDirectoryStatus.loading = false
        state.addDirectoryStatus.error =
          action.error.message || 'Failed to create directory'
      })
  },
})

export default directoriesSlice.reducer
