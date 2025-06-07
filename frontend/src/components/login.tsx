'use client'

import { useRouter } from 'next/navigation'

export const Login = () => {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-5 w-fit m-auto">
            <img
                className="h-52"
                src="https://img.daisyui.com/images/daisyui/mark-rotating.svg"
                alt="daisyui-mark-rotating"
            />
            <button
                onClick={() => {
                    router.replace(
                        process.env.NODE_ENV === 'production'
                            ? `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/login`
                            : '/login'
                    )
                }}
                className="btn btn-xl text-base-content/50"
            >
                Login with Ulysseus
            </button>
        </div>
    )
}
