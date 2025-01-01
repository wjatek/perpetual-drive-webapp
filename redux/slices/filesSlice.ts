import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { File } from '@/types/models'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface FilessState {
  filesByDirectoryId: { [key: string | '']: File[] }
  loading: { [key: string | '']: boolean }
  error: string | null
}

const initialState: FilessState = {
  filesByDirectoryId: {},
  loading: {},
  error: null,
}

export const fetchFiles = createAsyncThunk<File[], string | null>(
  'users/fetchFiles',
  async (id) => {
    const response = await api.get<File[]>(`/files?directoryId=${id || ''}`)
    return response.data
  }
)

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state, action) => {
        const id = action.meta.arg
        state.loading[id || ''] = true
        state.error = null
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        const id = action.meta.arg
        const files = action.payload
        state.filesByDirectoryId[id || ''] = files
        state.loading[id || ''] = false
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        const id = action.meta.arg
        state.loading[id || ''] = false
        state.error = action.error.message || 'Failed to fetch files'
      })
  },
})

export default filesSlice.reducer
