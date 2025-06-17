import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function estimateEndTime(task: any): any {
    // TODO chatGPT
    const startTime = new Date(task.createdAt)
    const currentTime = new Date(task.updatedAt)

    const elapsedTime = currentTime.getTime() - startTime.getTime()
    if (task.progress === 0) return null
    const estimatedTotalTime = elapsedTime / (task.progress / 100)
    const remainingTime = estimatedTotalTime - elapsedTime
    return new Date(currentTime.getTime() + remainingTime)
}

export const getLocalImagePath = (path: string): string => {
    const isProd = process.env.NODE_ENV === 'production'
    return `${isProd ? '/toolbox' : ''}${path}`
}
