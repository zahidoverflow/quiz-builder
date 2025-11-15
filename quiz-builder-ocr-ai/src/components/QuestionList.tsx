
import React from 'react';
import { Quiz } from '../types';
import { QuestionItem } from './QuestionItem';
import { AddIcon } from './Icons';

interface QuestionListProps {
  quizzes: Quiz[];
  onQuizChange: (id: number, updatedQuiz: Quiz) => void;
  onRemoveQuiz: (id: number) => void;
  onAddQuiz: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ quizzes, onQuizChange, onRemoveQuiz, onAddQuiz }) => {
  return (
    <div className="space-y-6">
      {quizzes.map((quiz, index) => (
        <QuestionItem
          key={quiz.id}
          quiz={quiz}
          index={index}
          onQuizChange={onQuizChange}
          onRemoveQuiz={onRemoveQuiz}
        />
      ))}
       <div className="pt-4">
        <button
          onClick={onAddQuiz}
          className="w-full flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 dark:border-gray-500 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <AddIcon className="w-5 h-5 mr-2" />
          Add Question
        </button>
      </div>
    </div>
  );
};
