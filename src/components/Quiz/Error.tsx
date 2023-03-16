interface ErrorProps {
  removeQuestions: () => void;
  isLightning: boolean;
}
export default function Error({ removeQuestions, isLightning }: ErrorProps) {
  if (isLightning)
    return (
      <section className="flex min-h-full w-full max-w-7xl flex-col py-10 transition-all">
        <div className=" flex flex-col place-content-center gap-3 py-5 lg:flex-row">
          <div className="relative flex w-full max-w-xl flex-col gap-5 overflow-clip rounded-2xl bg-slate-100 p-6 dark:bg-slate-900">
            <div className="flex justify-between">
              <div className="h-fit w-fit select-none rounded-full p-3 text-6xl font-black opacity-60">
                30
              </div>
            </div>

            <div className="m-auto flex h-full max-w-6xl flex-col rounded-3xl bg-red-100 p-6 dark:bg-red-900/40 md:place-items-center">
              <h2 className="mb-4 text-4xl font-black md:text-5xl">
                Something Went wrong :(
              </h2>
              <p className="text-2xl font-medium opacity-90 ">
                try reloading the website and make sure your internet is
                connected!
              </p>

              <button
                className="my-10 w-fit self-center rounded-xl bg-cyan-400 px-7 py-5 text-5xl font-black text-cyan-900 drop-shadow-xl hover:bg-cyan-300 
              active:ring-4 dark:bg-cyan-600 dark:text-cyan-100 dark:hover:bg-cyan-500"
                onClick={removeQuestions}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </section>
    );

  return (
    <div className="relative mx-2 flex h-full max-w-6xl flex-col rounded-3xl bg-red-100 p-6 dark:bg-red-900/40 md:place-items-center lg:mx-auto">
      <h2 className="mb-4 text-4xl font-black md:text-5xl">
        Something Went wrong :(
      </h2>
      <p className="text-2xl font-medium opacity-90 ">
        try reloading the website and make sure your internet is connected!
      </p>

      <button
        className="my-10 w-fit self-center rounded-xl bg-cyan-400 px-7 py-5 text-5xl font-black text-cyan-900 drop-shadow-xl transition-all hover:bg-cyan-300 
              active:ring-4 dark:bg-cyan-600 dark:text-cyan-100 dark:hover:bg-cyan-500"
        onClick={removeQuestions}
      >
        Try again
      </button>
    </div>
  );
}
