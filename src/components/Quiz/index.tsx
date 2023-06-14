import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useReward } from "react-rewards";

import { useState } from "react";

import { QuestionsConfig, QuizApiResponseObject } from "../../interfaces";

import ClassicQuiz from "./ClassicQuiz";
import Loading from "./Loading";
import Error from "./Error";
import LightningQuiz from "./LightningQuiz";

export default function Quiz({
  questionsConfig,
}: {
  questionsConfig: QuestionsConfig;
}) {
  const [inputs, setInputs] = useState<number[]>([]);
  const [answerIndex, setAnswerIndex] = useState<number[]>([]);
  const { reward: confettiReward } = useReward("confettiID", "confetti", {
    angle: -20,
    elementCount: 100,
    spread: 90,
    startVelocity: 30,
  });
  const { reward: confettiReward2 } = useReward("confettiID2", "confetti", {
    angle: 200,
    elementCount: 100,
    spread: 90,
    startVelocity: 30,
  });

  const {
    data: questions,
    isFetching: isFetchingQuestions,
    isLoading: isLoadingQuestions,
    isError: isErrorQuestions,
    isSuccess: isSuccessQuestions,
    refetch: refetchQuestions,
    remove: removeQuestions,
    status,
  } = useQuery<QuizApiResponseObject[]>({
    queryKey: ["questions", questionsConfig],
    queryFn: () => getQuestions(questionsConfig),
    onSuccess: (questions) => {
      setAnswerIndex(GenerateCorrectAnswerPositions(questions));
      if (questionsConfig.gameMode === "Classic")
        setInputs(new Array(questions.length).fill(-1));
    },
  });

  function fireConfettiReward() {
    confettiReward();
    confettiReward2();
  }

  if (isSuccessQuestions && questions.length < 1) {
    refetchQuestions();
  }

  if (isFetchingQuestions || isLoadingQuestions)
    return (
      <Loading
        questionCount={questionsConfig.count}
        isLightning={questionsConfig.gameMode === "Lightning"}
      />
    );

  if (isErrorQuestions)
    return (
      <Error
        removeQuestions={removeQuestions}
        isLightning={questionsConfig.gameMode === "Lightning"}
      />
    );

  return (
    <>
      <span id="confettiID" className=" absolute left-2 top-2 bg-black" />
      <span id="confettiID2" className="absolute  right-2 top-2 bg-black" />
      {questionsConfig.gameMode === "Classic" ? (
        <ClassicQuiz
          questions={questions}
          refetchQuestions={refetchQuestions}
          inputs={inputs}
          setInputs={setInputs}
          answerIndex={answerIndex}
          fireConfettiReward={fireConfettiReward}
        />
      ) : (
        <LightningQuiz
          questions={questions}
          refetchQuestions={refetchQuestions}
          inputs={inputs}
          setInputs={setInputs}
          answerIndex={answerIndex}
          fireConfettiReward={fireConfettiReward}
        />
      )}
    </>
  );
}
function GenerateCorrectAnswerPositions(questions: QuizApiResponseObject[]) {
  const positions: number[] = [];
  for (let i = 0; i < questions.length; i++) {
    positions.push(Math.floor(Math.random() * 4));
  }
  return positions;
}

function getQuestions(questionsConfig: QuestionsConfig) {
  return axios
    .get(
      `https://opentdb.com/api.php?
         amount=${questionsConfig.count}&
         category=${questionsConfig.categoryID}&
         difficulty=${questionsConfig.difficulty}&
         type=${questionsConfig.questionType}&
         encode=url3986`
    )
    .then(({ data }) => data.results);
}
