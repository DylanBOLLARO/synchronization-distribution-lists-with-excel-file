export const SheetInformation = ({ files, setFiles }: any) => {
    const sheetInformation = files?.sheetInformation

    if (sheetInformation)
        return (
            <>
                <h1 className="text-xl font-semibold mr-auto mt-10">
                    <span className="badge badge-xl px-5">
                        {`Information on selected sheets`}
                    </span>
                </h1>

                {Object.keys(sheetInformation ?? {})?.length > 0 && (
                    <div className="tabs tabs-box">
                        {Object.keys(sheetInformation ?? {}).map(
                            (name: any) => {
                                return (
                                    <input
                                        onChange={(e) => {
                                            setFiles((prev: any) => ({
                                                ...prev,
                                                selectedSheet: e.target.value,
                                            }))
                                        }}
                                        key={`sheetInformation_${name}`}
                                        type="radio"
                                        checked={files.selectedSheet === name}
                                        value={name}
                                        name={`sheetInformation`}
                                        className="tab"
                                        aria-label={name}
                                    />
                                )
                            }
                        )}
                    </div>
                )}
            </>
        )
}
