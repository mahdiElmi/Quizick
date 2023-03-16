import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
} from "@tanstack/react-query";

export enum Status {
  Home,
  Quiz,
}

export interface QuestionsConfig {
  gameMode: "Classic" | "Lightning";
  count: number;
  categoryID: number;
  difficulty: string;
  questionType: string;
}

export interface RadioGroupProps {
  title: string;
  name: keyof QuestionsConfig;
  optionList: {
    option: string;
    description?: string;
  }[];
  questionsConfig: QuestionsConfig;
  setQuestionsConfig: React.Dispatch<React.SetStateAction<QuestionsConfig>>;
}

export interface SimpleRadioGroupProps {
  title: string;
  name: keyof QuestionsConfig;
  options: number[] | string[];
  questionsConfig: QuestionsConfig;
  setQuestionsConfig: React.Dispatch<React.SetStateAction<QuestionsConfig>>;
}

export interface QuizApiResponseObject {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category: string;
  type: "multiple" | "Boolean";
  difficulty: "easy" | "medium" | "hard";
}

export interface HomeProps {
  setQuestionsConfig: React.Dispatch<React.SetStateAction<QuestionsConfig>>;
  questionsConfig: QuestionsConfig;
  setCurrentStatus: React.Dispatch<React.SetStateAction<Status>>;
}
export interface QuizProps {
  questions: QuizApiResponseObject[];
  refetchQuestions: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<QuizApiResponseObject[], unknown>>;
  inputs: number[];
  setInputs: React.Dispatch<React.SetStateAction<number[]>>;
  answerIndex: number[];
  fireConfettiReward: () => void;
}
