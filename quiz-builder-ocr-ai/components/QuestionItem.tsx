
import React from 'react';
import { Quiz } from '../types';
import { TrashIcon } from './Icons';

interface QuestionItemProps {
  quiz: Quiz;
  index: number;
  onQuizChange: (id: number, updatedQuiz: Quiz) => void;
  onRemoveQuiz: (id: number) => void;
}

const optionKeys: (keyof Quiz['options'])[] = ['A', 'B', 'C', 'D'];

export const QuestionItem: React.FC<QuestionItemProps> = ({ quiz, index, onQuizChange, onRemoveQuiz }) => {
  
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onQuizChange(quiz.id, { ...quiz, question: e.target.value });
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, optionKey: keyof Quiz['options']) => {
    onQuizChange(quiz.id, {
      ...quiz,
      options: {
        ...quiz.options,
        [optionKey]: e.target.value,
      },
    });
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="flex justify-between items-start mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {`Question ${index + 1}`}
        </label>
        <button
          onClick={() => onRemoveQuiz(quiz.id)}
          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Remove question"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      <textarea
        value={quiz.question}
        onChange={handleQuestionChange}
        rows={3}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 transition"
      />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {optionKeys.map(key => (
          <div key={key} className="flex items-center">
            <span className="mr-2 font-semibold text-gray-700 dark:text-gray-300">{key}.</span>
            <input
              type="text"
              value={quiz.options[key]}
              onChange={(e) => handleOptionChange(e, key)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
