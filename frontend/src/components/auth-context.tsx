'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext<any>(undefined)

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState(undefined)

    const isEmpty = (obj: any) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }

    async function fetchUser() {
        try {
            const response = await fetch(
                process.env.NODE_ENV === 'production'
                    ? `${process.env.NEXT_PUBLIC_NGINX_PREFIX}/user`
                    : '/user'
            )
            const userResponse = await response.text()
            setUser(userResponse ? JSON.parse(userResponse) : null)
        } catch (error) {
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
                isEmpty,
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
