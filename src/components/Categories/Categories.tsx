import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { QuestionsConfig } from "../../interfaces";
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";
interface Category {
  id: number;
  name: string;
}

interface CategoriesProps {
  questionsConfig: QuestionsConfig;
  setQuestionsConfig: React.Dispatch<React.SetStateAction<QuestionsConfig>>;
}

export default function Categories({
  questionsConfig,
  setQuestionsConfig,
}: CategoriesProps) {
  const {
    data: categoryList,
    isSuccess,
    isError,
  } = useQuery<Category[]>({
    initialData: JSON.parse(localStorage.getItem("categoryList")!) || undefined,
    enabled: localStorage.getItem("categoryList") === null,
    queryKey: ["categoryList"],
    queryFn: getCategoryList,
    onSuccess: (categoryList) => {
      localStorage.setItem("categoryList", JSON.stringify(categoryList));
    },
  });
  const [query, setQuery] = useState("");

  let filteredCategories: Category[];
  if (isSuccess) {
    filteredCategories =
      query === ""
        ? categoryList
        : categoryList.filter((category) =>
            category.name.toLowerCase().includes(query.toLowerCase())
          );
  }

  return (
    <Combobox
      as="div"
      className="flex w-full items-center gap-5 "
      value={questionsConfig.categoryID}
      onChange={updateOptions}
    >
      <Combobox.Label className="text-2xl font-semibold sm:text-3xl">
        Category
      </Combobox.Label>
      {isSuccess ? (
        <div className="relative ml-auto">
          <Combobox.Input
            className="w-full rounded-md border-2 border-gray-500 bg-slate-50 py-2 pl-3 pr-10 font-medium shadow-sm 
            focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 dark:border-slate-400  dark:bg-slate-900 focus:dark:border-cyan-500"
            onChange={(event) => setQuery(event.target.value)}
            defaultValue={questionsConfig.categoryID}
            displayValue={(categoryID: number) => {
              const foundCategory = categoryList.find(
                (category) => category.id === categoryID
              );
              if (!foundCategory) return "";
              return foundCategory.name;
            }}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </Combobox.Button>

          {filteredCategories!.length > 0 && (
            <Combobox.Options
              className=" absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md
             bg-slate-50 py-1 text-base font-medium shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-900"
            >
              {filteredCategories!.map((category) => (
                <Combobox.Option
                  key={category.id}
                  value={category.id}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-default select-none py-2 pl-3 pr-9",
                      active ? "bg-cyan-600 text-white" : ""
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={clsx(
                          "block truncate",
                          selected ? "font-semibold" : ""
                        )}
                      >
                        {category.name}
                      </span>

                      {selected && (
                        <span
                          className={clsx(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-cyan-600"
                          )}
                        >
                          <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              fillRule="evenodd"
                              d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      ) : isError ? (
        <div className="ml-auto w-1/2 rounded-md border border-red-300 bg-red-100 p-1 text-center  text-sm font-medium shadow-sm dark:bg-red-900/50">
          Unable to fetch categories. Please check your internet connection and
          try again.
        </div>
      ) : (
        <div className="ml-auto h-11 w-1/2 animate-pulse rounded-lg bg-slate-500/75" />
      )}
    </Combobox>
  );

  function updateOptions(value: any) {
    setQuestionsConfig((oldConfig) => ({
      ...oldConfig,
      categoryID: value,
    }));
  }
}

async function getCategoryList() {
  const { data } = await axios.get<{ trivia_categories: Category[] }>(
    "https://opentdb.com/api_category.php"
  );

  return data.trivia_categories.map((category) => {
    const shorterCategoryName = category.name
      .replace("Entertainment:", "")
      .replace("Science:", "");
    return {
      id: category.id,
      name: shorterCategoryName,
    };
  });
}
