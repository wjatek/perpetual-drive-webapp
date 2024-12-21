import { createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { createSlice } from './createAppSlice'
import { Post } from './models'

interface PostsState {
  list: Post[]
  status: string // TODO change to loading flag
  error: string | null
  addPostStatus: {
    loading: boolean
    error: string | null
  }
}

const initialState: PostsState = {
  list: [],
  status: 'idle',
  error: null,
  addPostStatus: {
    loading: false,
    error: null,
  },
}

export const fetchPosts = createAsyncThunk<Post[]>(
  'posts/fetchPosts',
  async () => {
    const response = await api.get<Post[]>('/posts')
    return response.data
  }
)

export const createPost = createAsyncThunk<Post, Pick<Post, 'content'>>(
  'posts/createPost',
  async (post) => {
    const response = await api.post<Post>('/posts', post)
    return response.data
  }
)

export const likePost = createAsyncThunk<Post, { postId: string }>(
  'posts/likePost',
  async ({ postId }) => {
    const response = await api.post<Post>(`/posts/${postId}/like`)
    return response.data
  }
)

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch posts'
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.list.find((p) => p.id === action.payload.id)
        if (post) post.likedBy = action.payload.likedBy
      })
      .addCase(createPost.pending, (state) => {
        state.addPostStatus.loading = true
        state.addPostStatus.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.list.push(action.payload)
        state.addPostStatus.loading = false
      })
      .addCase(createPost.rejected, (state, action) => {
        state.addPostStatus.loading = false
        state.addPostStatus.error =
          action.error.message || 'Failed to create post'
      })
  },
})

export default postSlice.reducer
