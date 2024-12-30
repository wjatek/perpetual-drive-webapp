import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import commentsSlice from './slices/commentsSlice'
import postsSlice from './slices/postsSlice'
import usersSlice from './slices/usersSlice'

const rootReducer = combineReducers({
  auth: authSlice,
  posts: postsSlice,
  comments: commentsSlice,
  users: usersSlice,
})
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  })
}

export type Store = ReturnType<typeof makeStore>
export type Dispatch = Store['dispatch']
export type Thunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
