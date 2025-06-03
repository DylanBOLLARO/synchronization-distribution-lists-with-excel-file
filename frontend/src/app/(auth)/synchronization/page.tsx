'use client'

import { useAuth } from '@/components/auth-context'
import { RadialProgress } from '@/components/radial-progress'
import { useCurrentSynchronization } from '@/lib/queries'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Page() {
    async function getFileSharepoint() {
        try {
            const response = (
                await axios.get(
                    // TODO remove static url
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

    async function getInformationofExcelFileById(id: string) {
        return (
            // TODO remove static url
            (
                await axios.post(
                    'http://localhost:3002/sheet-information',
                    null,
                    {
                        params: {
                            id,
                        },
                    }
                )
            ).data
        )
    }

    async function startSynchronization() {
        try {
            // TODO remove static url
            axios.post('http://localhost:3002/synchronization')
            setConfCurrentSynchronization((prev: any) => {
                return { ...prev, enable: true }
            })
        } catch (error) {
            console.error(error)
        }
    }

    const [files, setFiles] = useState<any>({
        currentProgress: undefined,
        files: [],
        selected: null,
        sheetNames: [],
        sheetInformation: null,
        selectedSheet: null,
        validSyntax: false,
        progress: 0,
        enableAutoRefresh: true,
    })

    const [confCurrentSynchronization, setConfCurrentSynchronization] =
        useState<any>({
            enable: true,
        })

    const { data: currentSynchronization } = useCurrentSynchronization(
        confCurrentSynchronization
    )

    useEffect(() => {
        if (currentSynchronization == undefined) return

        if (!currentSynchronization) {
            getFileSharepoint()
            setConfCurrentSynchronization((prev: any) => {
                return { ...prev, enable: false }
            })
        }
    }, [currentSynchronization])

    if (currentSynchronization) {
        return (
            <RadialProgress progressTick={currentSynchronization?.progress} />
        )
    }

    return (
        <div>
            <div className="flex flex-col gap-5">
                <div
                    className={cn(
                        'font-bold',
                        files.files.length > 0 ? 'text-accent' : 'text-red-600'
                    )}
                >
                    {files.files.length > 0
                        ? 'Select a file from the following choices'
                        : 'Unable to find files, contact an admin'}
                </div>
                <div className="flex gap-3 flex-wrap filter">
                    <input
                        onChange={(e) => {
                            setFiles((prev: any) => ({
                                ...prev,
                                selected: null,
                                sheetInformation: null,
                                validSyntax: false,
                            }))
                        }}
                        className="btn filter-reset"
                        type="radio"
                        name="chose_file"
                        aria-label="All"
                    />
                    {files?.files?.map((file: any, index: number) => {
                        return (
                            <div key={index} className="flex flex-col gap-3">
                                <input
                                    onChange={async (e) => {
                                        setFiles((prev: any) => ({
                                            ...prev,
                                            selected: files.files.find(
                                                (f: any) =>
                                                    f.name == e.target.value
                                            ),
                                            sheetInformation: undefined,
                                        }))
                                        const res =
                                            await getInformationofExcelFileById(
                                                files.files.find(
                                                    (f: any) =>
                                                        f.name == e.target.value
                                                ).id
                                            )

                                        if (res) {
                                            setFiles((prev: any) => ({
                                                ...prev,
                                                sheetInformation: res,
                                            }))
                                        } else {
                                            setFiles((prev: any) => ({
                                                ...prev,
                                                validSyntax: true,
                                                sheetInformation: null,
                                            }))
                                        }
                                    }}
                                    className={cn(
                                        'btn',
                                        `${files?.selected?.name === file.name ? 'bg-accent text-base-100' : ''}`
                                    )}
                                    type="radio"
                                    value={file.name}
                                    name="chose_file"
                                    aria-label={file.name}
                                />
                            </div>
                        )
                    })}
                </div>

                {files.sheetInformation === undefined && (
                    <span className="mx-auto loading loading-spinner loading-xl" />
                )}

                {files.sheetInformation && (
                    <ul className="list bg-base-100 rounded-box shadow-md">
                        {Object.entries(files.sheetInformation).map((dict) => {
                            const [sheet, aliasDict] = dict
                            return (
                                <>
                                    <li className="list-row alert alert-error">
                                        <div>
                                            <div className="flex gap-2">
                                                <p className="text-md uppercase font-black">
                                                    Sheet :
                                                </p>
                                                <p className="text-md  font-semibold">{`${sheet}`}</p>
                                            </div>
                                            {/* @ts-ignore */}
                                            {Object.entries(aliasDict).map(
                                                (aliasd) => {
                                                    const [alias, message] =
                                                        aliasd
                                                    return (
                                                        <>
                                                            <div className="flex gap-2">
                                                                <p className="text-md uppercase font-black">
                                                                    Alias :
                                                                </p>
                                                                <p className="text-md  font-semibold">{`${alias}`}</p>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <p className="text-md uppercase font-black">
                                                                    Error :
                                                                </p>
                                                                <p className="text-md  font-semibold">{`${message}`}</p>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            )}
                                        </div>
                                    </li>
                                </>
                            )
                        })}
                    </ul>
                )}
                {files.validSyntax && (
                    <button className="btn" onClick={startSynchronization}>
                        Start Synchronization
                    </button>
                )}
                {/* TODO to remove ? */}
                {/* <SheetNames files={files} setFiles={setFiles} /> */}
                {/* TODO to remove ? */}
                {/* <SheetInformation files={files} setFiles={setFiles} /> */}
            </div>
        </div>
    )
}
