'use client'

import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext<any>(undefined)

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(undefined)

    async function fetchUser() {
        try {
            const response = axios.get(
                process.env.NODE_ENV === 'production'
                    ? `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/user`
                    : '/user'
            )
            const userResponse = (await response)?.data ?? null
            setUser(userResponse)
        } catch (error) {
            setUser(null)
            console.error(error)
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuth = () => {
    const authContext = useContext(AuthContext)
    if (authContext === undefined) {
        throw new Error('useAuth must be inside a AuthProvider')
    }
    return authContext
}
