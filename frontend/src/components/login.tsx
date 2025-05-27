'use client'

import { useRouter } from 'next/navigation'

export const Login = () => {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-5 w-fit mx-auto">
            <img
                className="h-52"
                src="https://img.daisyui.com/images/daisyui/mark-rotating.svg"
                alt="daisyui-mark-rotating"
            />
            <button
                onClick={() => {
                    router.replace(
                        process.env.NODE_ENV === 'production'
                            ? `${process.env.NEXT_PUBLIC_BACKEND_STUDENT_PORTAL_URL}/login`
                            : '/login'
                    )
                }}
                className="btn bg-[#2F2F2F] text-white btn-xl"
            >
                Login with Ulysseus
            </button>
        </div>
    )
}
