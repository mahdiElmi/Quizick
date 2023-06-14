import { HomeProps, Status } from "../interfaces";
import GameModeRadioGroup from "./GameModeRadioGroup";
import SimpleRadioGroup from "./SimpleRadioGroup";
import Categories from "./Categories";
import { motion } from "framer-motion";

export default function Home({
  setQuestionsConfig: setQuestionsConfig,
  questionsConfig,
  setCurrentStatus,
}: HomeProps) {
  return (
    <motion.section
      layout
      className="flex h-full w-full flex-col place-items-center self-center text-3xl tracking-tight sm:max-w-3xl"
    >
      <motion.h1
        layout
        className="mt-12 w-max bg-gradient-to-br from-cyan-500 to-cyan-700 bg-clip-text px-2 text-7xl font-black uppercase tracking-tighter text-transparent sm:mb-5 sm:mt-8 sm:text-9xl"
      >
        quizick
      </motion.h1>
      <motion.div
        layout
        className="flex w-full max-w-xl flex-col items-center gap-8 rounded-md p-5 "
      >
        <motion.div layout className="w-full">
          <GameModeRadioGroup
            questionsConfig={questionsConfig}
            setQuestionsConfig={setQuestionsConfig}
          />
        </motion.div>

        <motion.div layout className="w-full">
          <Categories
            questionsConfig={questionsConfig}
            setQuestionsConfig={setQuestionsConfig}
          />
        </motion.div>
        {questionsConfig.gameMode === "Classic" && (
          <motion.div
            key="questionCount"
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <SimpleRadioGroup
              title="Question Count"
              name="count"
              options={[5, 10, 15]}
              questionsConfig={questionsConfig}
              setQuestionsConfig={setQuestionsConfig}
            />
          </motion.div>
        )}
        <motion.div layout className="w-full">
          <SimpleRadioGroup
            title="Difficulty"
            name="difficulty"
            options={["easy", "medium", "hard"]}
            questionsConfig={questionsConfig}
            setQuestionsConfig={setQuestionsConfig}
          />
        </motion.div>
      </motion.div>
      <motion.button
        layout="position"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="group relative mb-2 mt-7 w-4/6 overflow-clip rounded-xl bg-cyan-400 px-7 py-3 text-2xl font-bold tracking-tighter drop-shadow-xl transition-all hover:bg-cyan-300 active:ring-4 dark:bg-cyan-600 dark:hover:bg-cyan-500"
        onClick={() => setCurrentStatus(Status.Quiz)}
      >
        <span className="group absolute inset-0 h-full w-full scale-x-0 rounded-xl bg-white/30 group-hover:animate-shine" />
        Start
      </motion.button>
    </motion.section>
  );
}
