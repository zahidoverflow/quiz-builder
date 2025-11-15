
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { QuestionList } from './components/QuestionList';
import { extractQuizzesFromImage } from './services/geminiService';
import { Quiz } from './types';
import { CopyIcon, SparklesIcon, StartOverIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImageFile(file);
    setImageDataUrl(dataUrl);
    setQuizzes([]);
    setError(null);
  };

  const handleProcessImage = useCallback(async () => {
    if (!imageDataUrl) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizzes([]);

    try {
      const base64Data = imageDataUrl.split(',')[1];
      const result = await extractQuizzesFromImage(base64Data);
      // Assign a temporary unique ID for React keys
      const quizzesWithIds = result.map((q, index) => ({ ...q, id: Date.now() + index }));
      setQuizzes(quizzesWithIds);
    } catch (err) {
      console.error(err);
      setError("Failed to extract quizzes. The image might be unclear or the format is not supported. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [imageDataUrl]);

  const handleQuizChange = (id: number, updatedQuiz: Quiz) => {
    setQuizzes(prevQuizzes =>
      prevQuizzes.map(q => (q.id === id ? updatedQuiz : q))
    );
  };

  const handleRemoveQuiz = (id: number) => {
    setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== id));
  };
    
  const handleAddQuiz = () => {
    const newQuiz: Quiz = {
        id: Date.now(),
        question: '',
        options: { A: '', B: '', C: '', D: '' }
    };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  const handleCopy = () => {
    const formattedText = quizzes.map((quiz, index) => {
      return `${index + 1}. ${quiz.question}\nA. ${quiz.options.A}\nB. ${quiz.options.B}\nC. ${quiz.options.C}\nD. ${quiz.options.D}`;
    }).join('\n\n');

    navigator.clipboard.writeText(formattedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleStartOver = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setQuizzes([]);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Quiz Bank Generator
          </h1>
          <a
            href="https://ai.google.dev/gemini-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Powered by Gemini
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Uploader and Controls */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">1. Upload Quiz Image</h2>
              <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageDataUrl} />
            </div>
            
            {imageDataUrl && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">2. Process & Review</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Click the button to extract questions using AI. You can edit the results on the right.</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleProcessImage}
                    disabled={isLoading || !imageDataUrl}
                    className="w-full flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Processing...' : 'Extract Quizzes'}
                  </button>
                  <button
                    onClick={handleStartOver}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  >
                    <StartOverIcon className="w-5 h-5 mr-2" />
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Extracted Quizzes</h2>
                {quizzes.length > 0 && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                )}
            </div>
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">AI is analyzing your image...</p>
              </div>
            )}

            {error && <p className="text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-md">{error}</p>}
            
            {!isLoading && quizzes.length === 0 && !error && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Your extracted quizzes will appear here.</p>
                </div>
            )}

            {quizzes.length > 0 && (
              <QuestionList 
                quizzes={quizzes} 
                onQuizChange={handleQuizChange} 
                onRemoveQuiz={handleRemoveQuiz}
                onAddQuiz={handleAddQuiz}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
