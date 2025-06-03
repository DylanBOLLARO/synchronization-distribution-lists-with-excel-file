'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from './auth-context'

export const Providers = (props: any) => {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{props.children}</AuthProvider>
        </QueryClientProvider>
    )
}
