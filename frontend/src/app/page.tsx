'use client'

import { useAuth } from '@/components/auth-context'
import { Login } from '@/components/login'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'

export default function Home() {
    const { user } = useAuth()
    const router = useRouter()
    const id = useId()
    const [files, setFiles] = useState<any>({
        files: [],
        selected: null,
    })

    async function getFileSharepoint() {
        try {
            const response = (
                await axios.get(
                    'http://localhost:3002/get-files-in-sharepoint-folder'
                )
            ).data
            setFiles((prev: any) => ({
                ...prev,
                files: response,
            }))
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (user) getFileSharepoint()
    }, [user])

    return (
        <div className="flex items-center flex-col gap-5">
            <h1 className="text-xl font-semibold">
                Synchronization Distribution Lists With Excel File
            </h1>

            <div>
                {user ? (
                    <button
                        onClick={() => {
                            router.replace('/logout')
                        }}
                        className="btn bg-[#2F2F2F] text-white"
                    >
                        Logout
                    </button>
                ) : (
                    <Login />
                )}
            </div>

            {user && (
                <>
                    <div>{user?.userinfo?.name}</div>

                    <div
                        className={cn(
                            'font-bold',
                            files.files.length > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                        )}
                    >
                        {files.files.length > 0
                            ? 'Select a file from the following choices'
                            : 'Unable to find files, contact an admin'}
                    </div>

                    {/* {files.files.length > 0 && (
                        <RadioGroup
                            className="gap-2 max-w-[400px]"
                            onValueChange={(e) => {
                                setFiles((prev: any) => ({
                                    ...prev,
                                    selected: prev.files[e],
                                }))
                            }}
                        >
                            {files.files.map((file: any, index: number) => {
                                return (
                                    <div
                                        key={'file_' + index}
                                        className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring"
                                    >
                                        <RadioGroupItem
                                            value={'' + index}
                                            id={`${id}-${index}`}
                                            aria-describedby={`${id}-${index}-description`}
                                            className="order-1 after:absolute after:inset-0"
                                        />
                                        <div className="grid grow gap-2">
                                            <Label htmlFor={`${id}-1`}>
                                                {file.name}
                                            </Label>
                                            <p
                                                id={`${id}-1-description`}
                                                className="text-xs text-muted-foreground"
                                            >
                                                Last Modified :{' '}
                                                {(() => {
                                                    // chatGPT
                                                    const date = new Date(
                                                        file.lastModifiedDateTime
                                                    )

                                                    const options: Intl.DateTimeFormatOptions =
                                                        {
                                                            timeZone:
                                                                'Europe/Paris',
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: '2-digit',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false,
                                                        }

                                                    return date
                                                        .toLocaleString(
                                                            'fr-FR',
                                                            options
                                                        )
                                                        .replace(/\//g, '.')
                                                        .replace(',', '')
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </RadioGroup>
                    )} */}
                    {!files.selected && <>plz select one</>}

                    <button
                        onClick={() => {
                            console.log(files.selected)
                        }}
                        className="btn bg-[#2F2F2F] text-white"
                    >
                        Start updating aliases
                    </button>
                </>
            )}
        </div>
    )
}
