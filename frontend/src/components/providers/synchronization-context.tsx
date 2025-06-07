'use client'

import { useCurrentSynchronization } from '@/lib/queries'
import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

const SynchronizationContext = createContext<any>(undefined)

export const SynchronizationProvider = ({ children }: any) => {
    const [
        enableAutoRefreshCurrentSynchronization,
        setEnableAutoRefreshCurrentSynchronization,
    ] = useState<boolean>(true)

    const defaultFiles = {
        listSharepointFiles: undefined,
        currentSelectedSharepointFile: null,
        sheetInformation: null,
        enableAutoRefreshCurrentSynchronization,
        setEnableAutoRefreshCurrentSynchronization,
    }

    async function getFilesSharepoint() {
        setSharepoint((prev: any) => ({
            ...prev,
            listSharepointFiles: undefined,
        }))

        try {
            const response = (
                await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_SHAREPOINT_URL}/get-files-in-sharepoint-folder`
                )
            ).data

            setSharepoint((prev: any) => ({
                ...prev,
                listSharepointFiles: response,
            }))
        } catch (error) {
            console.error(error)
        }
    }

    async function getInformationofExcelFileById(id: string) {
        return (
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_SHAREPOINT_URL}/sheet-information`,
                null,
                {
                    params: {
                        id,
                    },
                }
            )
        ).data
    }

    async function startSynchronization() {
        try {
            axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_SHAREPOINT_URL}/synchronization`
            )
            setEnableAutoRefreshCurrentSynchronization(true)
        } catch (error) {
            console.error(error)
        }
    }

    async function unselectFile() {
        setSharepoint((prev: any) => {
            return {
                ...prev,
                currentSelectedSharepointFile:
                    defaultFiles.currentSelectedSharepointFile,
                sheetInformation: defaultFiles.sheetInformation,
            }
        })
    }

    const [sharepoint, setSharepoint] = useState<any>(defaultFiles)

    const { data: currentSynchronization } = useCurrentSynchronization(
        enableAutoRefreshCurrentSynchronization
    )

    useEffect(() => {
        if (currentSynchronization == undefined) return

        if (!currentSynchronization) {
            getFilesSharepoint()
            setEnableAutoRefreshCurrentSynchronization(false)
            setSharepoint(defaultFiles)
        }
    }, [currentSynchronization])

    return (
        <SynchronizationContext.Provider
            value={{
                ...sharepoint,
                currentSynchronization,
                setSharepoint,
                getInformationofExcelFileById,
                startSynchronization,
                unselectFile,
                getFilesSharepoint,
            }}
        >
            {children}
        </SynchronizationContext.Provider>
    )
}

export default SynchronizationProvider

export const useSynchronization = () => {
    const synchronizationContext = useContext(SynchronizationContext)
    if (synchronizationContext === undefined) {
        throw new Error(
            'useSynchronization must be inside a SynchronizationProvider'
        )
    }
    return synchronizationContext
}
