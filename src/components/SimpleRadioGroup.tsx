import { RadioGroup } from "@headlessui/react";
import { SimpleRadioGroupProps } from "../interfaces";
import clsx from "clsx";

export default function SimpleRadioGroup({
  title,
  name,
  options,
  questionsConfig: questionsConfig,
  setQuestionsConfig: setQuestionsConfig,
}: SimpleRadioGroupProps) {
  function updateOptions(value: number) {
    setQuestionsConfig((oldConfig) => ({
      ...oldConfig,
      [name]: value,
    }));
  }
  return (
    <div className="flex w-full items-center gap-4 ">
      <h2 className="cursor-default text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
      <RadioGroup
        value={questionsConfig[name]}
        onChange={updateOptions}
        name={name}
        className="ml-auto flex sm:flex-row"
      >
        {options.map((option) => (
          <RadioGroup.Option
            key={option}
            value={option}
            className={({ active, checked }) =>
              clsx(
                checked
                  ? "border-transparent bg-cyan-600 text-white hover:bg-cyan-700"
                  : "border-cyan-500 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800",
                "flex cursor-pointer items-center justify-center border-y-2 py-2 px-3 font-medium uppercase",
                "first:rounded-l-xl  first:border-l-2 last:rounded-r-xl last:border-r-2 sm:flex-1"
              )
            }
          >
            <RadioGroup.Label as="span" className="text-lg">
              {option}
            </RadioGroup.Label>
          </RadioGroup.Option>
        ))}
      </RadioGroup>
    </div>
  );
}
