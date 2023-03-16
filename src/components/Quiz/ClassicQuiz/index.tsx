import clsx from "clsx";

import { ChangeEvent, FormEvent, useState } from "react";
import { QuizApiResponseObject, QuizProps } from "../../../interfaces";

export default function ClassicQuiz({
  questions,
  refetchQuestions,
  inputs,
  setInputs,
  answerIndex,
  fireConfettiReward,
}: QuizProps) {
  const [isSubmitted, setIsSubmitted] = useState<Boolean>(false);
  const [score, setScore] = useState<number>(0);

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
          ? `cursor-not-allowed  opacity-70 ${
              didChooseCorrectly
                ? "bg-green-300 text-emerald-900 pr-1 border-green-300 "
                : didChooseIncorrectly
                ? "bg-red-300 text-rose-900 pr-1 border-red-300"
                : ""
            }`
          : isChecked
          ? "cursor-pointer border-transparent bg-cyan-500/60 hover:bg-cyan-500/70"
          : "cursor-pointer hover:bg-cyan-500/10";
        return (
          <label
            key={answer}
            className={`${answerClasses} my-3 flex place-items-center justify-center gap-2 break-words rounded-full
             border-[3px] border-cyan-500/40 p-2 text-center transition-all lg:px-3`}
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
            {isSubmitted &&
              (didChooseCorrectly ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 min-h-max w-6 min-w-max fill-green-500 p-0 "
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                didChooseIncorrectly && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 min-h-max w-6 min-w-max text-red-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                      clipRule="evenodd"
                    />
                  </svg>
                )
              ))}
          </label>
        );
      });
      return (
        <div key={questionObj.question} className="flex flex-col">
          <h3 className="text-lg font-bold md:text-2xl">
            {decodeURIComponent(questionObj.question)}
          </h3>
          <div className="mb-9 mt-2 grid w-full grid-cols-2 flex-row justify-center gap-x-5 text-lg font-semibold sm:grid-cols-[repeat(4,fit-content(40%))] sm:justify-start sm:text-xl">
            {answerElements}
          </div>
        </div>
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
  }

  function submitAnswers(e: FormEvent) {
    const score = inputs.reduce((previousValue, currentValue, index) => {
      return previousValue + (inputs[index] === answerIndex[index] ? 1 : 0);
    }, 0);
    if (score === answerIndex.length) {
      fireConfettiReward();
    }
    setScore(score);
    setIsSubmitted(true);
  }

  function restartGame() {
    setIsSubmitted(false);
    refetchQuestions();
    setScore(0);
  }

  function getQuizReport() {
    const scorePercentage = (score * 100) / questions.length;
    const scoreColor =
      scorePercentage < 31
        ? "border-red-500 text-red-500 bg-red-200 dark:bg-red-900/30"
        : scorePercentage > 70
        ? "border-lime-500 text-lime-500 bg-lime-200 dark:bg-lime-900/30"
        : "border-yellow-500 text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";

    const scoreText =
      scorePercentage < 50
        ? "While there is room for improvement, you still gave it your best shot! Keep practicing and you'll get better in no time."
        : scorePercentage > 85
        ? scorePercentage === 100
          ? "Congratulations! You have achieved perfect score! You truly have a wealth of knowledge and should be proud of your accomplishment. Keep up the great work and continue to challenge yourself with new and exciting quizzes."
          : "Wow! You really know your stuff! Your performance was outstanding. Keep challenging yourself and aim for even higher scores next time!"
        : "You did really well! Your knowledge on the subject is impressive. Keep up the good work!";
    return (
      <div className="relative my-5 flex flex-row items-center gap-6 rounded-md bg-slate-200 p-5 text-3xl dark:bg-slate-800">
        <div
          className={clsx(
            "flex h-36 w-44 select-none items-center justify-center self-center rounded-full border-8 bg-white py-9 px-2 text-5xl font-black dark:bg-black",
            scoreColor
          )}
        >
          <>{scorePercentage}%</>
        </div>
        <p className="text-xl font-semibold md:text-3xl">{scoreText}</p>
      </div>
    );
  }

  return (
    <section className="mx-auto flex min-h-full w-full max-w-6xl flex-col p-0 py-10 sm:p-7 lg:mt-12">
      <div className="flex flex-col gap-3 py-5  lg:flex-row">
        <div className="flex w-full flex-col p-6 lg:p-0">
          {questionElements}
          {isSubmitted && getQuizReport()}
          {!isSubmitted ? (
            <button
              className="group relative my-10 overflow-clip rounded-xl bg-cyan-400 px-7 py-5 text-5xl font-black text-cyan-900 drop-shadow-xl transition-all 
              hover:bg-cyan-300 active:ring-4 dark:bg-cyan-600 dark:text-cyan-100 dark:hover:bg-cyan-500"
              onClick={submitAnswers}
            >
              <span className="group absolute inset-0 h-full w-full scale-x-0 rounded-xl bg-white/40 blur-md group-hover:animate-shine" />
              Submit
            </button>
          ) : (
            <button
              className="group relative my-10 overflow-clip rounded-xl bg-cyan-400 px-7 py-5 text-5xl font-black text-cyan-900 drop-shadow-xl transition-all 
              hover:bg-cyan-300 active:ring-4 dark:bg-cyan-600 dark:text-cyan-100 dark:hover:bg-cyan-500"
              onClick={restartGame}
            >
              <span className="group absolute inset-0 h-full w-full scale-x-0 rounded-xl bg-white/40 blur-md group-hover:animate-shine" />
              Play again
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
