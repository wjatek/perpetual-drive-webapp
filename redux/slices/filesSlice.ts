import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { File } from '@/types/models'
import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface FilessState {
  filesByDirectoryId: { [key: string | '']: File[] }
  loading: { [key: string | '']: boolean }
  error: string | null
  fileDownloading: { [key: string | '']: boolean }
  fileDownloadingProgress: { [key: string | '']: number }
}

const initialState: FilessState = {
  filesByDirectoryId: {},
  loading: {},
  error: null,
  fileDownloading: {},
  fileDownloadingProgress: {},
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
  reducers: {
    setFileDownloading(
      state,
      action: PayloadAction<{ id: string; isDownloading: boolean }>
    ) {
      const { id, isDownloading } = action.payload
      state.fileDownloading[id] = isDownloading
    },
    setFileDownloadingProgress(
      state,
      action: PayloadAction<{ id: string; value: number }>
    ) {
      const { id, value } = action.payload
      state.fileDownloadingProgress[id] = value
    },
  },
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

export const { setFileDownloading, setFileDownloadingProgress } =
  filesSlice.actions
export default filesSlice.reducer
