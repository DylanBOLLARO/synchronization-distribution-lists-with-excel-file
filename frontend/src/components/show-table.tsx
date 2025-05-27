export const ShowTable = () => {
    return (
        <>
            {files?.selectedSheet && (
                <>
                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                        <table className="table">
                            {/* head */}

                            <thead>
                                <tr>
                                    <th></th>
                                    {Object.keys(
                                        files?.sheetInformation?.[
                                            files?.selectedSheet
                                        ]
                                    ).map((colName: string) => {
                                        return (
                                            <th key={'header_' + colName}>
                                                {colName}
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(
                                    files?.sheetInformation?.[
                                        files?.selectedSheet
                                    ]?.[
                                        Object.keys(
                                            files?.sheetInformation?.[
                                                files?.selectedSheet
                                            ]
                                        )?.[0]
                                    ]
                                ).map((_, i) => {
                                    return (
                                        <tr key={'_' + i}>
                                            <td>{i + 1}</td>
                                            {Object.keys(
                                                files?.sheetInformation?.[
                                                    files?.selectedSheet
                                                ]
                                            ).map((colName: string) => {
                                                if (
                                                    ['members', 'owner'].some(
                                                        (keyword) =>
                                                            colName
                                                                .toLowerCase()
                                                                .includes(
                                                                    keyword
                                                                )
                                                    )
                                                ) {
                                                    return (
                                                        <td
                                                            key={colName}
                                                            className={cn(
                                                                'text-nowrap',
                                                                `${
                                                                    (files?.sheetInformation?.[
                                                                        files
                                                                            ?.selectedSheet
                                                                    ][colName][
                                                                        i
                                                                    ].includes(
                                                                        ','
                                                                    ) ||
                                                                        !(
                                                                            files?.sheetInformation?.[
                                                                                files
                                                                                    ?.selectedSheet
                                                                            ][
                                                                                colName
                                                                            ][
                                                                                i
                                                                            ].split(
                                                                                ';'
                                                                            )
                                                                                ?.length >
                                                                            0
                                                                        )) &&
                                                                    'bg-red-500/50'
                                                                }`
                                                            )}
                                                        >
                                                            {files?.sheetInformation?.[
                                                                files
                                                                    ?.selectedSheet
                                                            ][colName][i]
                                                                .split(';')
                                                                .map(
                                                                    (
                                                                        nameMember: string
                                                                    ) => (
                                                                        <p
                                                                            key={
                                                                                nameMember
                                                                            }
                                                                        >
                                                                            {
                                                                                nameMember
                                                                            }
                                                                        </p>
                                                                    )
                                                                )}
                                                        </td>
                                                    )
                                                }
                                                return (
                                                    <td key={colName}>
                                                        {
                                                            files
                                                                ?.sheetInformation?.[
                                                                files
                                                                    ?.selectedSheet
                                                            ][colName][i]
                                                        }
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </>
    )
}
