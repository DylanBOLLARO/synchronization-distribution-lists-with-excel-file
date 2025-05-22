'use client'

import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
    const { user } = useAuth()
    const router = useRouter()

    const [isFileExist, setIsFileExist] = useState<boolean>(false)

    async function getFileSharepoint() {
        try {
            const response = (await axios.get('http://localhost:3002')).data
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen flex-col gap-5">
            <div>
                {user ? (
                    <>
                        <Button
                            size={'lg'}
                            variant="secondary"
                            onClick={() => {
                                router.replace('/logout')
                            }}
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button
                        size={'lg'}
                        variant="outline"
                        onClick={() => {
                            router.replace(
                                process.env.NODE_ENV === 'production'
                                    ? `${process.env.NEXT_PUBLIC_BACKEND_STUDENT_PORTAL_URL}/login`
                                    : '/login'
                            )
                        }}
                    >
                        Login
                    </Button>
                )}
            </div>
            {user && (
                <>
                    <div>{user?.userinfo?.name}</div>

                    <div className="flex gap-5 items-center">
                        <div
                            className={cn(
                                'font-bold',
                                isFileExist ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            file validity: {'' + isFileExist}
                        </div>
                        <div>
                            <Button onClick={getFileSharepoint}>
                                Research
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
