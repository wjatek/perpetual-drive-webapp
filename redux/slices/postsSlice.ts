import { createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../lib/api'
import { Post } from '../../types/models'
import { createSlice } from '../createAppSlice'

interface PostsState {
  list: Post[]
  status: string // TODO change to loading flag
  error: string | null
  addPostStatus: {
    loading: boolean
    error: string | null
  }
  likePostStatus: {
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
  likePostStatus: {
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

export const toggleLike = createAsyncThunk<Post, { id: string }>(
  'posts/toggleLike',
  async ({ id }) => {
    const response = await api.post<Post>(`/posts/${id}/like`)
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

      .addCase(createPost.pending, (state) => {
        state.addPostStatus.loading = true
        state.addPostStatus.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
        state.addPostStatus.loading = false
      })
      .addCase(createPost.rejected, (state, action) => {
        state.addPostStatus.loading = false
        state.addPostStatus.error =
          action.error.message || 'Failed to create post'
      })

      .addCase(toggleLike.pending, (state) => {
        state.likePostStatus.loading = true
        state.likePostStatus.error = null
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { id } = action.payload
        const postIndex = state.list.findIndex((post) => post.id === id)
        if (postIndex !== -1) {
          state.list[postIndex] = action.payload
        } else {
          state.list.push(action.payload)
        }
        state.likePostStatus.loading = false
      })
      .addCase(toggleLike.rejected, (state, action) => {
        state.likePostStatus.loading = false
        state.likePostStatus.error =
          action.error.message || 'Failed to like post'
      })
  },
})

export default postSlice.reducer
