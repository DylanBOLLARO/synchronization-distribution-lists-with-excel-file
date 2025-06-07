import axios from 'axios'

export const getCurrentSynchronization = async () => {
    return (
        (
            await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_AUTH_URL}/progress/get-current-progress`
            )
        ).data ?? null
    )
}
