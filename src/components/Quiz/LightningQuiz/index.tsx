import { ChangeEvent, useEffect, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

import { QuizApiResponseObject, QuizProps } from "../../../interfaces";
import clsx from "clsx";

export default function LightningQuiz({
  questions,
  refetchQuestions,
  inputs,
  setInputs,
  answerIndex,
  fireConfettiReward,
}: QuizProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const scoreMotion = useMotionValue(score);
  const roundedScoreMotion = useTransform(scoreMotion, (latest) =>
    Math.round(latest)
  );
  const [showScoreIncrementor, setShowScoreIncrementor] = useState(false);

  const [streak, setStreak] = useState(1);
  const [highScore, setHighScore] = useState<number>(
    JSON.parse(localStorage.getItem("highScore")!) || 0
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [swipeAnimationState, setSwipeAnimationState] = useState<
    "left" | "right"
  >("right");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let timerId: number;

    if (showScoreIncrementor) {
      timerId = setTimeout(() => {
        setShowScoreIncrementor(false);
      }, 800);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [showScoreIncrementor]);

  useEffect(() => {
    animate(scoreMotion, score);
  }, [score]);

  useEffect(() => {
    localStorage.setItem("highScore", JSON.stringify(highScore));
  }, [highScore]);

  useEffect(() => {
    const timerIntervalID = setInterval(() => {
      setTimer((oldTime) => {
        if (oldTime < 1) {
          setIsSubmitted(true);
          if (scoreMotion.get() > highScore) {
            setHighScore(scoreMotion.get());
            fireConfettiReward();
          }
          clearInterval(timerIntervalID);
          return 0;
        }
        return --oldTime;
      });
    }, 1000);
    return () => {
      clearInterval(timerIntervalID);
    };
  }, []);

  function decodeAndAssignCorrectAnswer(
    questionObj: QuizApiResponseObject,
    index: number
  ) {
    // its just incorrect answers first but the right answer will be added at a random position
    let answersDecoded = questionObj.incorrect_answers.map((incorrect_answer) =>
      decodeURIComponent(incorrect_answer)
    );
    const correctAnswerDecoded = decodeURIComponent(questionObj.correct_answer);
    answersDecoded.splice(answerIndex[index], 0, correctAnswerDecoded);
    return answersDecoded;
  }
  // returns an array of random numbers which correct answers will be positioned at
  const questionElements = questions.map(
    (questionObj: QuizApiResponseObject, index) => {
      const answers = decodeAndAssignCorrectAnswer(questionObj, index);
      const answerElements = answers.map((answer, idx) => {
        const isChecked = inputs[index] === idx;
        const didChooseCorrectly = answerIndex[index] === idx;
        const didChooseIncorrectly = inputs[index] === idx;
        const answerClasses = isSubmitted
          ? `cursor-default opacity-95 ${
              didChooseCorrectly
                ? "bg-emerald-300 text-emerald-900 border-emerald-300 "
                : didChooseIncorrectly
                ? "bg-rose-300 text-rose-900 border-rose-300"
                : ""
            }`
          : isChecked
          ? "cursor-pointer border-transparent bg-cyan-500/60 hover:bg-cyan-500/70"
          : "cursor-pointer hover:bg-cyan-500/10";
        return (
          <label
            key={answer}
            className={`${answerClasses} my-3 flex place-items-center justify-center gap-2 break-words rounded-full 
            border-[3px] border-cyan-500/40 p-2 text-center shadow transition-all`}
          >
            <input
              className="hidden"
              type="radio"
              id={answer}
              disabled={isSubmitted as boolean}
              name={index.toString()}
              value={idx}
              checked={isChecked}
              onChange={handleInputChange}
              aria-hidden="true"
            />
            {answer}
          </label>
        );
      });

      return (
        <motion.div
          initial={{
            x: swipeAnimationState === "left" ? -100 : 100,
            opacity: 0,
          }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          layout
          key={questionObj.question}
          className="flex flex-col gap-10"
        >
          <motion.h3
            layout
            className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-100 md:text-3xl"
          >
            {decodeURIComponent(questionObj.question)}
          </motion.h3>
          <motion.div
            layout
            className="grid w-full grid-cols-2 justify-center gap-x-5 text-sm font-semibold md:text-2xl"
          >
            {answerElements}
          </motion.div>
        </motion.div>
      );
    }
  );

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.currentTarget;
    setInputs((oldInputs) => {
      const newInputs = [...oldInputs];
      newInputs[parseInt(name)] = parseInt(value);
      return newInputs;
    });
    if (parseInt(value) === answerIndex[currentQuestionIndex]) {
      setScore((oldScore) => (oldScore += 5 * streak));
      setStreak((oldStreak) => ++oldStreak);
      setShowScoreIncrementor(true);
    } else {
      setStreak(1);
    }
    setCurrentQuestionIndex((currentQuestionIndex) => ++currentQuestionIndex);
  }

  function restartGame() {
    setIsSubmitted(false);
    refetchQuestions();
    setInputs([]);
    setScore(0);
  }

  function changeQuestion(toPrevious: boolean) {
    if (currentQuestionIndex < 1 && toPrevious) return;
    if (currentQuestionIndex > inputs.length - 1 && !toPrevious) return;
    toPrevious
      ? setSwipeAnimationState("left")
      : setSwipeAnimationState("right");
    setCurrentQuestionIndex((lastQuestionIndex) =>
      toPrevious ? --lastQuestionIndex : ++lastQuestionIndex
    );
  }

  return (
    <section className="flex min-h-full w-full max-w-7xl flex-col items-center justify-center py-10 transition-all">
      <motion.div layout className="flex flex-col items-center py-5">
        <motion.div layout className="flex px-1 md:gap-2">
          {isSubmitted && (
            <motion.button
              layout
              disabled={currentQuestionIndex < 1}
              onClick={() => changeQuestion(true)}
              whileHover={currentQuestionIndex >= 1 ? { translateX: -3 } : {}}
              className="h-44 cursor-pointer self-center rounded-lg bg-transparent p-0  
               enabled:hover:brightness-110 enabled:active:brightness-95 disabled:cursor-default disabled:opacity-50 md:py-5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-7 w-7 stroke-[3px] "
              >
                <motion.path
                  animate={{ pathLength: 1 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </motion.button>
          )}
          <motion.div
            layout
            onPanEnd={(e, pointInfo) => {
              if (e.pointerType === "mouse") return;
              if (pointInfo.offset.x < 0) changeQuestion(false);
              if (pointInfo.offset.x > 0) changeQuestion(true);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") changeQuestion(false);
              if (e.key === "ArrowLeft") changeQuestion(true);
            }}
            className="relative flex w-full max-w-xl touch-pan-y flex-col gap-5 overflow-clip rounded-2xl 
            bg-slate-50 p-6 outline-cyan-500 focus:outline-8 dark:bg-slate-900"
          >
            <motion.div
              layout
              className={clsx(
                "flex",
                isSubmitted ? "justify-center" : "justify-between"
              )}
            >
              <motion.div
                layout="position"
                className="flex h-fit w-fit items-center text-4xl font-black md:text-6xl"
              >
                <motion.span>{roundedScoreMotion}</motion.span>
                <AnimatePresence mode="popLayout">
                  {showScoreIncrementor && (
                    <motion.span
                      className="inline-block self-center text-3xl font-bold text-emerald-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      +{5 * (streak - 1)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {!isSubmitted && (
                <div
                  className={clsx(
                    "h-fit w-fit text-4xl font-black transition-colors duration-1000 md:text-6xl",
                    timer <= 10 && "animate-pulse text-red-500/90"
                  )}
                >
                  {timer}
                </div>
              )}
            </motion.div>
            <AnimatePresence mode="popLayout">
              {questionElements[currentQuestionIndex]}
            </AnimatePresence>
          </motion.div>
          {isSubmitted && (
            <motion.button
              layout
              disabled={currentQuestionIndex > inputs.length - 1}
              whileHover={
                currentQuestionIndex <= inputs.length - 1
                  ? { translateX: 3 }
                  : {}
              }
              onClick={() => changeQuestion(false)}
              className="h-44 cursor-pointer self-center rounded-lg bg-transparent p-0 enabled:hover:brightness-110  
              enabled:active:brightness-95 disabled:cursor-default disabled:opacity-50 md:py-5 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-7 w-7 stroke-[3px]"
              >
                <motion.path
                  animate={{ pathLength: 1 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </motion.button>
          )}
        </motion.div>

        {isSubmitted && (
          <motion.div
            layout
            className="flex w-full max-w-xl flex-col p-6 lg:p-0"
          >
            <div className="mb-6 mt-0 flex flex-col rounded-md bg-slate-200 p-4 text-center text-2xl font-bold dark:bg-slate-800 md:text-3xl lg:mt-6">
              {score >= highScore ? (
                <span> 🏆 New personal best! 🏆</span>
              ) : (
                <span>
                  You were {(score * 100) / highScore > 70 ? "just" : ""}{" "}
                  {highScore - score} points away from beating your high score!
                </span>
              )}
            </div>
            <button
              className="group relative overflow-clip rounded-xl bg-cyan-400 px-7 py-5 text-4xl font-black text-cyan-900 drop-shadow-xl transition-all hover:bg-cyan-300 active:ring-4 
              dark:bg-cyan-600 dark:text-cyan-100 dark:hover:bg-cyan-500 md:text-5xl"
              onClick={restartGame}
            >
              <span className="group absolute inset-0 h-full w-full scale-x-0 rounded-xl bg-white/40 blur-md group-hover:animate-shine" />
              Play again
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
