import '@/styles/globals.css'

import { QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { Toaster } from 'sonner'

import { UserProvider } from '@/context/userContext'
import { queryClient } from '@/lib/queryClient'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Toaster richColors />
        <Component {...pageProps} />
      </UserProvider>
    </QueryClientProvider>
  )
}
