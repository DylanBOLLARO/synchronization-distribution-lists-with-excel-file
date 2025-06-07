export const RadialProgress = ({ progressTick = 0 }: any) => {
    return (
        <div className="flex flex-col items-center gap-3">
            <p className="text-xl text-base-content/75">Progress</p>
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
