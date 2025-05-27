import { cn } from '@/lib/utils'

export const SheetNames = ({ files }: any) => {
    if (files?.sheetNames?.length > 0) {
        return (
            <>
                <h1 className="text-xl font-semibold mr-auto">
                    <span className="badge badge-xl px-5">
                        {`List of sheets detected in the Excel file ( ${files?.sheetNames?.length ?? 0} sheets )`}
                    </span>
                </h1>

                <div className="flex gap-3">
                    <div className={`badge badge-soft badge-success`}>
                        Sheets that will be used
                    </div>
                    <div className={`badge badge-soft badge-warning`}>
                        Sheets that will not be used
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    {files?.sheetNames?.map((sheet: any) => {
                        return (
                            <div
                                key={`sheetNames_${sheet}`}
                                className={cn(
                                    `badge badge-xl badge-soft ${sheet == 'raw_list' ? 'badge-warning' : 'badge-success'}`
                                )}
                            >
                                {sheet}
                            </div>
                        )
                    })}
                </div>
            </>
        )
    }
}
