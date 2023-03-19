import { useEffect, useState } from "react";
import { QuestionsConfig, Status } from "./interfaces";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import { motion, AnimatePresence } from "framer-motion";

import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

function App() {
  const [currentStatus, setCurrentStatus] = useState<Status>(Status.Home);
  const [questionsConfig, setQuestionConfig] = useState<QuestionsConfig>(
    JSON.parse(localStorage.getItem("questionsConfig")!) || {
      gameMode: "Classic",
      count: 10,
      categoryID: 9,
      difficulty: "medium",
      questionType: "multiple&encode",
    }
  );
  const queryClient = useQueryClient();
  const [darkMode, setDarkMode] = useState<Boolean>(
    document.documentElement.classList.contains("dark")
  );

  useEffect(
    () =>
      localStorage.setItem("questionsConfig", JSON.stringify(questionsConfig)),
    [questionsConfig]
  );

  // set dark mode based on local storage or system default
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  function toggleDarkMode() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setDarkMode(true);
    }
  }

  return (
    <div
      className="theme-orange relative z-10 flex min-h-screen place-content-center overflow-clip bg-gradient-to-tl from-slate-200 to-slate-100 
      text-slate-700 transition-all selection:bg-cyan-500 selection:text-cyan-50 dark:from-slate-900 dark:to-slate-800 dark:text-slate-200"
    >
      <nav
        className={clsx(
          "pointer-events-none fixed z-50 flex w-full  justify-center rounded-b-md pt-5 pb-2 backdrop-blur-none ",
          currentStatus !== Status.Home &&
            " pointer-events-auto backdrop-blur-sm"
        )}
      >
        <div
          className={clsx(
            "flex w-full justify-between px-5",
            questionsConfig.gameMode === "Classic" &&
              currentStatus !== Status.Home &&
              "max-w-6xl"
          )}
        >
          {currentStatus !== Status.Home && (
            <button
              className=" rounded-full transition-all hover:brightness-110 "
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: [
                    "questions",
                    sessionStorage.getItem("sessionToken"),
                  ],
                });
                setCurrentStatus(Status.Home);
              }}
              title="back to home page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8 md:h-8 md:w-8"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileHover={{ pathLength: 1 }}
                  d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  whileHover={{ pathLength: 1 }}
                  d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"
                />
              </svg>
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="pointer-events-auto z-20 ml-auto"
            title="Toggle dark mode"
          >
            <AnimatePresence mode="popLayout">
              {darkMode ? (
                <motion.div
                  key="nightIcon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="relative drop-shadow-[0px_0px_25px_#3b82f6]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="absolute top-0 right-0 h-4 fill-blue-500 sm:h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 fill-blue-500 sm:h-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              ) : (
                <motion.div
                  key="dayIcon"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 fill-yellow-500 drop-shadow-[0px_0px_15px_#eab308] sm:h-8"
                  >
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {currentStatus === Status.Home ? (
        <Home
          setQuestionsConfig={setQuestionConfig}
          questionsConfig={questionsConfig}
          setCurrentStatus={setCurrentStatus}
        />
      ) : (
        <motion.div layout className=" min-h-full w-full max-w-7xl ">
          <Quiz questionsConfig={questionsConfig} />
        </motion.div>
      )}
    </div>
  );
}

export default App;
