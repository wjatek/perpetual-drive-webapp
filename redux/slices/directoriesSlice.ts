import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { Directory } from '@/types/models'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface DirectoriesState {
  directoriesByParentId: { [key: string | '']: Directory[] }
  loading: { [key: string | '']: boolean }
  error: string | null
  directoryPath: { [key: string]: Pick<Directory, 'id' | 'name'>[] }
}

const initialState: DirectoriesState = {
  directoriesByParentId: {},
  loading: {},
  error: null,
  directoryPath: {},
}

export const fetchDirectories = createAsyncThunk<
  { directories: Directory[]; path: Pick<Directory, 'id' | 'name'>[] },
  string | null
>('users/fetchDirectories', async (id) => {
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
  },
})

export default directoriesSlice.reducer
