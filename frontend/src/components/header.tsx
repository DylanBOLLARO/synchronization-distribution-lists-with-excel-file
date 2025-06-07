'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from './providers/auth-context'

export const Header = () => {
    const router = useRouter()
    const { user } = useAuth()

    return (
        <div className="flex gap-3 my-5">
            <div className="navbar">
                <div className="flex-1">
                    <button
                        onClick={() => {
                            router.replace('/')
                        }}
                        className="btn text-base-content/75"
                    >
                        Home
                    </button>
                </div>
                <div className="flex gap-2">
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn avatar text-base-content/75"
                        >
                            {user?.userinfo?.name}
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <button
                                    onClick={() => {
                                        router.replace('/logout')
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
