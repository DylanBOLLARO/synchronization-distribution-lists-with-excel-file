'use client'

import { Loading } from '@/components/loading'
import { useSynchronization } from '@/components/providers'
import { RadialProgress } from '@/components/radial-progress'
import { cn, estimateEndTime } from '@/lib/utils'
import { format } from 'date-fns'

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
        return (
            <div className="border-2 border-base-300 rounded py-5">
                <div className="flex justify-center items-center">
                    <h2 className="text-xl font-semibold text-base-content/75">
                        Progress
                    </h2>
                </div>
                <div className="divider"></div>
                <div className="flex">
                    <RadialProgress
                        progressTick={currentSynchronization.progress}
                    />
                    <div className="flex-1 flex-col flex gap-5">
                        <p className="badge badge-xl badge-info badge-soft">
                            <svg
                                className="size-[1em]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    fill="currentColor"
                                    strokeLinejoin="miter"
                                    strokeLinecap="butt"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="square"
                                        stroke-miterlimit="10"
                                        strokeWidth="2"
                                    ></circle>
                                    <path
                                        d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="square"
                                        stroke-miterlimit="10"
                                        strokeWidth="2"
                                    ></path>
                                    <circle
                                        cx="12"
                                        cy="7.25"
                                        r="1.25"
                                        fill="currentColor"
                                        strokeWidth="2"
                                    ></circle>
                                </g>
                            </svg>
                            {`Start at ${format(currentSynchronization.createdAt, 'hh:mm a')}`}
                        </p>
                        <p className="badge badge-xl badge-success badge-soft">
                            <svg
                                className="size-[1em]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                                <g
                                    fill="currentColor"
                                    strokeLinejoin="miter"
                                    strokeLinecap="butt"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="square"
                                        stroke-miterlimit="10"
                                        strokeWidth="2"
                                    ></circle>
                                    <path
                                        d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="square"
                                        stroke-miterlimit="10"
                                        strokeWidth="2"
                                    ></path>
                                    <circle
                                        cx="12"
                                        cy="7.25"
                                        r="1.25"
                                        fill="currentColor"
                                        strokeWidth="2"
                                    ></circle>
                                </g>
                            </svg>
                            {currentSynchronization.progress >= 2
                                ? `Will end around ${format(estimateEndTime(currentSynchronization), 'hh:mm a')}`
                                : 'Unable to define an approximate time at the moment'}
                        </p>
                    </div>
                </div>
            </div>
        )
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
