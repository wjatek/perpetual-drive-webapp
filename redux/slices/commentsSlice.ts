import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { Comment } from '@/types/models'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface CommentsState {
  commentsByPostId: { [key: string]: Comment[] }
  loading: { [key: string]: boolean }
  error: string | null
  addCommentStatus: {
    loading: boolean
    error: string | null
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

export const fetchComments = createAsyncThunk<Comment[], string>(
  'comments/fetchComments',
  async (postId) => {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`)
    return response.data
  }
)

export const createComment = createAsyncThunk<
  Comment,
  { postId: string; comment: Pick<Comment, 'content'> }
>('comments/createComment', async ({ postId, comment }) => {
  const response = await api.post<Comment>(`/posts/${postId}/comments`, comment)
  return response.data
})

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
        state.error = action.error.message || 'Failed to fetch comments'
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
      .addCase(createComment.rejected, (state, action) => {
        state.addCommentStatus.loading = false
        state.addCommentStatus.error =
          action.error.message || 'Failed to add comment'
      })
  },
})

export default commentSlice.reducer
