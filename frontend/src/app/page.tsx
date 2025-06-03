'use client'

import { useAuth } from '@/components/auth-context'
import { Login } from '@/components/login'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user === undefined) return
        if (user) router.push('/synchronization')
        if (!user) router.push('/')
    }, [user])

    if (user === undefined)
        return <span className="mx-auto loading loading-spinner loading-xl" />

    if (!user) return <Login />
}
