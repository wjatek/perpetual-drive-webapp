import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { Directory } from '@/types/models'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface DirectoriesState {
  directoriesByParentId: { [key: string | '']: Directory[] }
  loading: { [key: string | '']: boolean }
  error: string | null
}

const initialState: DirectoriesState = {
  directoriesByParentId: {},
  loading: {},
  error: null,
}

export const fetchDirectories = createAsyncThunk<Directory[], string | null>(
  'users/fetchDirectories',
  async (id) => {
    const response = await api.get<Directory[]>(
      `/directories?parentId=${id || ''}`
    )
    return response.data
  }
)

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
        const directories = action.payload
        state.directoriesByParentId[id || ''] = directories
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
