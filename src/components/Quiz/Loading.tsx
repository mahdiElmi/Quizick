interface LoadingProps {
  questionCount: number;
  isLightning: boolean;
}

export default function Loading({
  questionCount,

  isLightning,
}: LoadingProps) {
  if (isLightning)
    return (
      <section className="flex min-h-full w-full max-w-7xl flex-col items-center justify-center py-10 transition-all">
        <div className="relative flex w-full max-w-xl flex-col gap-5 overflow-clip rounded-2xl bg-slate-100 p-6 dark:bg-slate-900">
          <div className="flex justify-between">
            <div className=" h-fit w-fit select-none  text-6xl font-black ">
              0
            </div>
            <div className=" h-fit w-fit select-none  text-6xl font-black">
              30
            </div>
          </div>

          <div className="flex animate-pulse flex-col gap-10">
            <div>
              <div className="h-6 w-11/12 rounded-full bg-slate-500/75 sm:w-full" />
              <div className="my-3 h-6 w-full rounded-full bg-slate-500/75 " />
              <div className="my-3 h-6 w-5/12 rounded-full bg-slate-500/75 " />
            </div>
            <div className="grid w-full grid-cols-2 justify-center gap-x-5 text-2xl font-medium">
              <div className=" my-3 flex h-12 w-full place-items-center justify-center gap-2 rounded-full bg-slate-500/50 py-4 px-6" />
              <div className=" my-3 flex h-12 w-full place-items-center justify-center gap-2 rounded-full bg-slate-500/50 py-4 px-6" />
              <div className=" my-3 flex h-12 w-full place-items-center justify-center gap-2 rounded-full bg-slate-500/50 py-4 px-6" />
              <div className=" my-3 flex h-12 w-full place-items-center justify-center gap-2 rounded-full bg-slate-500/50 py-4 px-6" />
            </div>
          </div>
        </div>
      </section>
    );

  function getSkeletonQuestionElements() {
    const elements: JSX.Element[] = [];
    for (let i = 0; i < questionCount; i++) {
      elements.push(
        <div className="w-full" key={i}>
          <div className="h-6 w-11/12 rounded-full bg-slate-500/75 sm:w-full" />
          <div className="my-3 h-6 w-full rounded-full bg-slate-500/75 sm:hidden" />
          <div className="my-3 h-6 w-5/12 rounded-full bg-slate-500/75 sm:hidden" />
          <div className="mb-10 mt-2 grid w-full grid-cols-2 flex-row place-items-center text-xl sm:grid-cols-[repeat(4,fit-content(50%))]">
            <div
              className={
                "m-4 flex h-12 w-36 rounded-full bg-slate-500/50 py-4 px-10 sm:w-16 md:w-32"
              }
            />
            <div
              className={
                "m-4 flex h-12 w-36 rounded-full bg-slate-500/50 py-4 px-10 sm:w-16 md:w-32"
              }
            />
            <div
              className={
                "m-4 flex h-12 w-36 rounded-full bg-slate-500/50 py-4 px-10 sm:w-16 md:w-32"
              }
            />
            <div
              className={
                "m-4 flex h-12 w-36 rounded-full bg-slate-500/50 py-4 px-10 sm:w-16 md:w-32"
              }
            />
          </div>
        </div>
      );
    }
    return elements;
  }
  return (
    <div className="mx-auto flex min-h-full w-full max-w-6xl flex-col p-0 py-10 sm:p-7 lg:mt-12">
      <div className="flex w-full flex-col gap-3 py-5 lg:flex-row">
        <div className="flex w-full animate-pulse flex-col place-items-center p-6 lg:p-0">
          {getSkeletonQuestionElements()}
          <div className="h-20 w-full rounded-xl bg-slate-500/50 py-2 " />
        </div>
      </div>
    </div>
  );
}
