import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import commentsSlice from './commentsSlice'
import postsSlice from './postsSlice'
import usersSlice from './usersSlice'
import authSlice from './authSlice'

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
