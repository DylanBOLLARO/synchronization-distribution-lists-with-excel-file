export const RadialProgress = ({ progressTick = 0 }: any) => {
    return (
        <div className="flex-1 flex flex-col items-center gap-3">
            <div
                className="radial-progress bg-base-200 text-sky-600/80 border-base-200 border-8"
                // @ts-ignore
                style={{ '--value': progressTick }}
                aria-valuenow={progressTick}
                role="progressbar"
            >
                {`${progressTick}%`}
            </div>
        </div>
    )
}
