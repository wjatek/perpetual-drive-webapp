import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { default as postsReducer, default as postsSlice } from './postsSlice'

const rootReducer = combineReducers(postsSlice)
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = () => {
  return configureStore({
    reducer: {
      posts: postsReducer,
    },
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
