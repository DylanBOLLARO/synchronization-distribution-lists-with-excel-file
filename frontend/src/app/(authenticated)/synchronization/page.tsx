'use client'

import { Loading } from '@/components/loading'
import { useSynchronization } from '@/components/providers'
import { RadialProgress } from '@/components/radial-progress'
import { cn } from '@/lib/utils'

export default function Page() {
    const {
        currentSynchronization,
        listSharepointFiles,
        currentSelectedSharepointFile,
        sheetInformation,
        setSharepoint,
        getInformationofExcelFileById,
        startSynchronization,
        unselectFile,
    } = useSynchronization()

    if (currentSynchronization) {
        return <RadialProgress progressTick={currentSynchronization.progress} />
    }

    return (
        <div>
            {listSharepointFiles === undefined && <Loading />}

            {listSharepointFiles?.length > 0 && (
                <div className="flex flex-col gap-5">
                    <div
                        className={cn(
                            'font-bold',
                            listSharepointFiles?.length > 0
                                ? 'text-sky-600/80'
                                : 'text-red-800/80'
                        )}
                    >
                        {listSharepointFiles?.length > 0
                            ? 'Select a file from the following choices'
                            : 'Unable to find files, contact an admin'}
                    </div>

                    <div className="flex flex-wrap filter">
                        <input
                            onChange={() => {
                                unselectFile()
                            }}
                            className="btn filter-reset"
                            type="radio"
                            name="chose_file"
                            aria-label="All"
                        />
                        <div className="flex gap-5">
                            {listSharepointFiles?.map(
                                (file: any, index: number) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col gap-3"
                                        >
                                            <input
                                                onChange={async (e) => {
                                                    setSharepoint(
                                                        (prev: any) => ({
                                                            ...prev,
                                                            currentSelectedSharepointFile:
                                                                listSharepointFiles.find(
                                                                    (f: any) =>
                                                                        f.name ==
                                                                        e.target
                                                                            .value
                                                                ),
                                                            sheetInformation:
                                                                undefined,
                                                        })
                                                    )
                                                    let res: any

                                                    try {
                                                        res =
                                                            await getInformationofExcelFileById(
                                                                listSharepointFiles.find(
                                                                    (f: any) =>
                                                                        f.name ==
                                                                        e.target
                                                                            .value
                                                                ).id
                                                            )
                                                    } catch (error) {
                                                        res = {
                                                            Excel: {
                                                                File: [
                                                                    'This file is not valid',
                                                                ],
                                                            },
                                                        }
                                                    }

                                                    if (
                                                        Object.keys(res)
                                                            .length === 0
                                                    ) {
                                                        setSharepoint(
                                                            (prev: any) => ({
                                                                ...prev,
                                                                sheetInformation:
                                                                    {},
                                                            })
                                                        )
                                                    } else {
                                                        setSharepoint(
                                                            (prev: any) => ({
                                                                ...prev,
                                                                sheetInformation:
                                                                    res,
                                                            })
                                                        )
                                                    }
                                                }}
                                                className={cn(
                                                    'btn text-base-content/50',
                                                    `${currentSelectedSharepointFile?.name === file.name ? 'bg-sky-600/80 text-base-100' : ''}`
                                                )}
                                                type="radio"
                                                value={file.name}
                                                name="chose_file"
                                                aria-label={file.name}
                                            />
                                        </div>
                                    )
                                }
                            )}
                        </div>
                    </div>

                    {sheetInformation === undefined && <Loading />}

                    {sheetInformation && (
                        <>
                            {Object.keys(sheetInformation)?.length > 0 && (
                                <ul className="list bg-base-100 rounded-box shadow-md">
                                    {Object.entries(sheetInformation).map(
                                        (dict) => {
                                            const [sheet, aliasDict]: any = dict
                                            return (
                                                <>
                                                    <li className="list-row alert bg-red-800/80 text-base-100 text-base">
                                                        <div>
                                                            <div className="flex gap-2">
                                                                <p className="text-md uppercase font-black">
                                                                    Sheet :
                                                                </p>
                                                                <p className="text-md  font-semibold">{`${sheet}`}</p>
                                                            </div>
                                                            {/* @ts-ignore */}
                                                            {Object.entries(
                                                                aliasDict
                                                            ).map((aliasd) => {
                                                                const [
                                                                    alias,
                                                                    message,
                                                                ] = aliasd
                                                                return (
                                                                    <>
                                                                        <div className="flex gap-2">
                                                                            <p className="text-md uppercase font-black">
                                                                                Alias
                                                                                :
                                                                            </p>
                                                                            <p className="text-md  font-semibold">{`${alias}`}</p>
                                                                        </div>

                                                                        <div className="flex gap-2">
                                                                            <p className="text-md uppercase font-black">
                                                                                Error
                                                                                :
                                                                            </p>
                                                                            <p className="text-md  font-semibold">{`${message}`}</p>
                                                                        </div>
                                                                    </>
                                                                )
                                                            })}
                                                        </div>
                                                    </li>
                                                </>
                                            )
                                        }
                                    )}
                                </ul>
                            )}

                            {Object.keys(sheetInformation)?.length == 0 && (
                                <button
                                    className="btn text-base-content/75"
                                    onClick={async () =>
                                        startSynchronization(
                                            currentSelectedSharepointFile.id
                                        )
                                    }
                                >
                                    Start Synchronization
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
