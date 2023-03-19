import { RadioGroup } from "@headlessui/react";
import { QuestionsConfig } from "../interfaces";
import clsx from "clsx";

interface GameModeProps {
  questionsConfig: QuestionsConfig;
  setQuestionsConfig: React.Dispatch<React.SetStateAction<QuestionsConfig>>;
}

const optionList = [
  {
    option: "Classic",
    description:
      "Relax and enjoy answering questions at a leisurely pace, with no clock ticking down.",
  },
  {
    option: "Lightning",
    description:
      "Race against the clock and see how many questions you can answer in just 30 seconds!",
  },
];

export default function OptionsRadioGroup({
  questionsConfig: questionsConfig,
  setQuestionsConfig: setQuestionsConfig,
}: GameModeProps) {
  function updateGameMode(value: "Classic" | "Lightning") {
    setQuestionsConfig((oldConfig) => ({
      ...oldConfig,
      gameMode: value,
      count: value === "Classic" ? 10 : 50,
    }));
  }

  return (
    <RadioGroup
      value={questionsConfig.gameMode}
      onChange={updateGameMode}
      name="gameMode"
      className="flex w-full flex-col gap-5"
    >
      <RadioGroup.Label className=" text-2xl font-semibold sm:text-3xl ">
        Game Mode
      </RadioGroup.Label>

      <div className="grid grid-cols-2 gap-5">
        {optionList.map(({ option, description }) => (
          <RadioGroup.Option
            key={option}
            value={option}
            className={({ checked, active }) =>
              clsx(
                checked
                  ? "border-cyan-500"
                  : "border-slate-500 dark:border-slate-400",
                "relative cursor-pointer rounded-lg border-2 bg-slate-50 p-3 focus:outline-none dark:bg-slate-900"
              )
            }
          >
            {({ checked, active }) => (
              <>
                <span className="flex flex-1">
                  <span className="flex flex-col">
                    <RadioGroup.Label
                      as="span"
                      className="block text-base font-semibold sm:text-xl"
                    >
                      {option}
                    </RadioGroup.Label>
                    {description && (
                      <RadioGroup.Description
                        as="span"
                        className="mt-1 flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 md:text-sm"
                      >
                        {description}
                      </RadioGroup.Description>
                    )}
                  </span>
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={clsx(
                    !checked ? "invisible" : "",
                    "absolute top-2 right-2 h-6 w-6 text-cyan-600"
                  )}
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>

                <span
                  className={clsx(
                    active ? "border" : "border-2",
                    checked ? "border-cyan-500" : "border-transparent",
                    "pointer-events-none absolute -inset-px rounded-lg"
                  )}
                  aria-hidden="true"
                />
              </>
            )}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
