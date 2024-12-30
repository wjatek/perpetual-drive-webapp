'use client'
import { setupListeners } from '@reduxjs/toolkit/query'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { setStore } from '../lib/api'
import type { Store } from './store'
import { makeStore } from './store'

interface Props {
  readonly children: ReactNode
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<Store | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
    setStore(storeRef.current)
  }

  useEffect(() => {
    if (storeRef.current != null) {
      const unsubscribe = setupListeners(storeRef.current.dispatch)
      return unsubscribe
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
