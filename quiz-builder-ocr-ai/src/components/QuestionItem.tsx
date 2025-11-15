
import React from 'react';
import { Quiz } from '../types';
import { TrashIcon } from './Icons';

interface QuestionItemProps {
  quiz: Quiz;
  index: number;
  onQuizChange: (id: number, updatedQuiz: Quiz) => void;
  onRemoveQuiz: (id: number) => void;
}

const optionKeys = ['A', 'B', 'C', 'D'] as const; // Make it a tuple for strict typing
type OptionKey = typeof optionKeys[number];

export const QuestionItem: React.FC<QuestionItemProps> = ({ quiz, index, onQuizChange, onRemoveQuiz }) => {
  
  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onQuizChange(quiz.id, { ...quiz, question: e.target.value });
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, optionKey: OptionKey) => {
    onQuizChange(quiz.id, {
      ...quiz,
      options: {
        ...quiz.options,
        [optionKey]: e.target.value,
      },
    });
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    // Set to undefined if 'Not set' is selected, otherwise use the selected value
    onQuizChange(quiz.id, { ...quiz, answer: selectedValue === '' ? undefined : selectedValue });
  };

  // Validation logic: answer is valid if it's undefined (not set) or one of the optionKeys
  const isValidAnswer = !quiz.answer || optionKeys.includes(quiz.answer as OptionKey);

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
      <div className="mt-4">
        <label htmlFor={`answer-${quiz.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Correct Answer
        </label>
        <select
          id={`answer-${quiz.id}`}
          value={quiz.answer || ''}
          onChange={handleAnswerChange}
          className={`w-full sm:w-auto p-2 border rounded-md bg-white dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 transition 
                      ${isValidAnswer ? 'border-gray-300 dark:border-gray-600' : 'border-red-500 dark:border-red-400 ring-red-500'}`}
          aria-label="Correct answer"
        >
          <option value="">Not set</option>
          {optionKeys.map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
        {!isValidAnswer && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            Invalid answer selected. Please choose A, B, C, D, or 'Not set'.
          </p>
        )}
      </div>
    </div>
  );
};