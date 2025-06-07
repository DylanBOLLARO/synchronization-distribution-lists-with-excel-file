'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()

    return (
        <div>
            <button
                onClick={() => {
                    router.push('/synchronization')
                }}
                className="flex flex-col gap-2 hover:scale-105 duration-200 grayscale-50 hover:grayscale-0 cursor-pointer"
            >
                <img
                    className="mask mask-squircle w-36"
                    src="/synchronization.jpg"
                />
                Synchronization
            </button>
        </div>
    )
}
