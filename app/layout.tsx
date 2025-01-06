import { ThemeProvider } from '@/context/themeContext'
import { PopupProvider } from '@/hooks/usePopup'
import { PromptProvider } from '@/hooks/usePrompt'
import { StoreProvider } from '@/redux/StoreProvider'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'
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
                <PopupProvider>
                  <PromptProvider>{children}</PromptProvider>
                </PopupProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </StoreProvider>
        </Suspense>
      </body>
    </html>
  )
}
