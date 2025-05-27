'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'

export const Header = () => {
    const router = useRouter()
    const { user } = useAuth()

    return (
        <div className="flex gap-3">
            <h1 className="text-xl font-semibold">
                Synchronization Distribution Lists With Excel File
            </h1>

            {user && (
                <div className="flex gap-3 justify-center items-center ml-auto">
                    <h2 className="text-lg font-semibold">
                        <span className="badge badge-accent badge-lg">
                            {user?.userinfo?.name ?? 'Dylan BOLLARO'}
                        </span>
                    </h2>
                    <button
                        onClick={() => {
                            router.replace('/logout')
                        }}
                        className="btn bg-[#2F2F2F] text-white w-fit"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    )
}
