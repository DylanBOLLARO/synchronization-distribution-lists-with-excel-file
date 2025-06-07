'use client'

import { Header } from '@/components/header'
import { Loading } from '@/components/loading'
import { useAuth } from '@/components/providers/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user === undefined) return
        if (!user) router.push('/auth')
    }, [user])

    return (
        <>
            {user && (
                <div className="flex flex-col gap-3">
                    <Header />
                    {children}
                </div>
            )}
        </>
    )
}
