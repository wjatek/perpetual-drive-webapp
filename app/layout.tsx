import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'
import { StoreProvider } from '../store/StoreProvider'
import { ThemeProvider } from '../context/themeContext'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Perpetual Drive',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <Suspense>
          <StoreProvider>
            <AppRouterCacheProvider>
              <ThemeProvider>
                <CssBaseline />
                {children}
              </ThemeProvider>
            </AppRouterCacheProvider>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  )
}
