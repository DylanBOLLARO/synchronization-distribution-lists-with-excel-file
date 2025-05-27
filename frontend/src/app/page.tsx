'use client'

import { useAuth } from '@/components/auth-context'
import { Login } from '@/components/login'
import { SheetInformation } from '@/components/sheet-information'
import { SheetNames } from '@/components/sheet-names'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { json } from 'stream/consumers'

export default function Home() {
    const { user } = useAuth()
    const router = useRouter()

    const [files, setFiles] = useState<any>({
        files: [],
        selected: null,
        sheetNames: [],
        sheetInformation: null,
        selectedSheet: null,
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

    // async function getInformationFromExcelFile() {
    //     setFiles((prev: any) => ({
    //         ...prev,
    //         sheetNames: undefined,
    //         sheetInformation: undefined,
    //     }))

    //     try {
    //         const response = await axios.get(
    //             'http://localhost:3002/sheet-names'
    //         )
    //         const sheetNames = response?.data?.data

    //         setFiles((prev: any) => ({
    //             ...prev,
    //             sheetNames: sheetNames,
    //         }))

    //         const filteredSheets = sheetNames.filter(
    //             (sheet: string) => (sheet ?? '') !== 'raw_list'
    //         )

    //         const infoResponse = (
    //             await axios.post(
    //                 'http://localhost:3002/sheet-information',
    //                 null,
    //                 {
    //                     params: {
    //                         q: JSON.stringify(filteredSheets),
    //                     },
    //                 }
    //             )
    //         ).data

    //         if (infoResponse) {
    //             setFiles((prev: any) => ({
    //                 ...prev,
    //                 sheetInformation: infoResponse.data,
    //                 selectedSheet: Object.entries(infoResponse.data)[0][0],
    //             }))
    //         }
    //     } catch (error) {
    //         setFiles((prev: any) => ({
    //             ...prev,
    //             sheetNames: [],
    //             sheetInformation: [],
    //         }))
    //         console.error(error)
    //     }
    // }

    async function getInformationofExcelFileById(id: string) {
        return (
            await axios.post('http://localhost:3002/sheet-information', null, {
                params: {
                    id,
                },
            })
        ).data
    }

    useEffect(() => {
        if (user) getFileSharepoint()
    }, [user])

    if (user === undefined)
        return <span className="mx-auto loading loading-spinner loading-xl" />

    if (!user) return <Login />

    return (
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
                                            (f: any) => f.name == e.target.value
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
                                    setFiles((prev: any) => ({
                                        ...prev,
                                        sheetInformation: res,
                                    }))
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
                {files.sheetInformation === undefined && (
                    <span className="mx-auto loading loading-spinner loading-xl" />
                )}
                {files.sheetInformation && (
                    <pre>
                        <code>
                            {JSON.stringify(files.sheetInformation, null, 4)}
                        </code>
                    </pre>
                )}
            </div>

            {/* <button
                onClick={getInformationofExcelFileById}
                className="btn bg-[#2F2F2F] text-white btn-xl w-fit mx-auto"
            >
                Excel Check
            </button> */}

            {/* <SheetNames files={files} setFiles={setFiles} /> */}
            {/* <SheetInformation files={files} setFiles={setFiles} /> */}
        </div>
    )
}
