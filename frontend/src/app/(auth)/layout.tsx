'use client'

import { useAuth } from '@/components/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user === undefined) return
        if (user === null) router.push('/')
    }, [user])

    return <section>{user && children}</section>
}
