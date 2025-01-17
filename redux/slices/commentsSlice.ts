import api from '@/lib/api'
import { ErrorResponse } from '@/types/errors'
import { Comment } from '@/types/models'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CommentsState {
  commentsByPostId: { [key: string]: Comment[] }
  loading: { [key: string]: boolean }
  error: ErrorResponse | null
  addCommentStatus: {
    loading: boolean
    error: ErrorResponse | null
  }
}

const initialState: CommentsState = {
  commentsByPostId: {},
  loading: {},
  error: null,
  addCommentStatus: {
    loading: false,
    error: null,
  },
}

export const fetchComments = createAsyncThunk<
  Comment[],
  string,
  { rejectValue: ErrorResponse }
>('comments/fetchComments', async (postId, { rejectWithValue }) => {
  try {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`)
    return response.data
  } catch (error: any) {
    const message = error.response?.data?.error || 'Failed to fetch comments'
    const details = error.response?.data?.details || null
    return rejectWithValue({ message, details })
  }
})

export const createComment = createAsyncThunk<
  Comment,
  { postId: string; comment: Pick<Comment, 'content'> },
  { rejectValue: ErrorResponse }
>(
  'comments/createComment',
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post<Comment>(
        `/posts/${postId}/comments`,
        comment
      )
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add comment'
      const details = error.response?.data?.details || null
      return rejectWithValue({ message, details })
    }
  }
)

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg
        state.loading[postId] = true
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const postId = action.meta.arg
        const comments = action.payload
        state.commentsByPostId[postId] = comments
        state.loading[postId] = false
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const postId = action.meta.arg
        state.loading[postId] = false
        state.error = action.payload ?? null
      })
      .addCase(createComment.pending, (state) => {
        state.addCommentStatus.loading = true
        state.addCommentStatus.error = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId } = action.payload
        if (!state.commentsByPostId[postId]) {
          state.commentsByPostId[postId] = []
        }
        state.commentsByPostId[postId].push(action.payload)
        state.addCommentStatus.loading = false
      })
      .addCase(
        createComment.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.addCommentStatus.loading = false
          state.addCommentStatus.error = action.payload ?? null
        }
      )
  },
})

export default commentSlice.reducer
