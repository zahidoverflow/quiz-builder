import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { QuestionList } from './components/QuestionList';
import { extractQuizzesFromImage } from './services/geminiService';
import { Quiz } from './types';
import { CopyIcon, SparklesIcon, StartOverIcon, DocumentTextIcon } from './components/Icons';
import * as pdfjsLib from 'pdfjs-dist';

// Set workerSrc for pdfjs-dist
const PDF_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.5.136/build/pdf.worker.mjs';
if (typeof window !== 'undefined' && 'Worker' in window) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDocsCopied, setIsDocsCopied] = useState<boolean>(false);

  const handleFilesUpload = (uploadedFiles: File[]) => {
    setFiles(prevFiles => {
        // Create a set of existing file names for quick lookup
        const existingFileNames = new Set(prevFiles.map(f => f.name));
        // Filter out any files that are already in the list
        const newFiles = uploadedFiles.filter(f => !existingFileNames.has(f.name));
        // Combine the old and new files
        return [...prevFiles, ...newFiles];
    });
    setQuizzes([]);
    setError(null);
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const pdfToImagesBase64 = async (file: File): Promise<string[]> => {
    const images: string[] = [];
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      setProcessingStatus(`Processing ${file.name} (page ${i}/${pdf.numPages})...`);
      const page = await pdf.getPage(i);
      // Use a higher scale for better resolution, which improves AI accuracy.
      const viewport = page.getViewport({ scale: 3.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) continue;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Set a white background to prevent transparency issues from PDFs.
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: context, viewport }).promise;
      // Use PNG for lossless image quality, which is better for text analysis.
      images.push(canvas.toDataURL('image/png').split(',')[1]);
    }
    return images;
  };

  const handleProcessFiles = useCallback(async () => {
    if (files.length === 0) {
      setError("Please upload one or more files first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuizzes([]);

    try {
      let allQuizzes: Omit<Quiz, 'id'>[] = [];
      for (const file of files) {
        setProcessingStatus(`Processing ${file.name}...`);
        let extractedQuizzes: Omit<Quiz, 'id'>[] = [];
        if (file.type.startsWith('image/')) {
          const base64Data = await fileToBase64(file);
          extractedQuizzes = await extractQuizzesFromImage(base64Data, file.type);
        } else if (file.type === 'application/pdf') {
          const imageBases64 = await pdfToImagesBase64(file);
          for (const base64Data of imageBases64) {
             const pageQuizzes = await extractQuizzesFromImage(base64Data, 'image/png');
             extractedQuizzes.push(...pageQuizzes);
          }
        }
        allQuizzes = [...allQuizzes, ...extractedQuizzes];
      }
      const quizzesWithIds = allQuizzes.map((q, index) => ({ ...q, id: Date.now() + index }));
      setQuizzes(quizzesWithIds);

    } catch (err) {
      console.error(err);
      setError("Failed to extract quizzes. An image might be unclear or a file format is not supported. Please try again.");
    } finally {
      setIsLoading(false);
      setProcessingStatus(null);
    }
  }, [files]);

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

  const getPlainTextQuizzes = () => {
    const questionsText = quizzes.map((quiz, index) => {
      const optionsText = Object.entries(quiz.options)
        .map(([key, value]) => `${key}. ${value}`)
        .join('\n');
      return `${index + 1}. ${quiz.question}\n${optionsText}`;
    }).join('\n\n');
    
    const hasAnyAnswer = quizzes.some(q => q.answer);
    if (!hasAnyAnswer) {
      return questionsText;
    }

    const answerList = quizzes.map((quiz, index) => 
      `${String(index + 1).padStart(2, '0')}. ${quiz.answer || '___'}`
    ).join('\n');

    const answersSection = `\n\nAnswers:\n${answerList}`;

    return questionsText + answersSection;
  };

  const handleCopy = () => {
    const formattedText = getPlainTextQuizzes();
    navigator.clipboard.writeText(formattedText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleCopyToDocs = () => {
    const plainText = getPlainTextQuizzes();
    
    const escapeHtml = (unsafe: string) => 
        unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");

    const questionsHtml = quizzes.map((quiz, index) => {
      const question = escapeHtml(quiz.question);
      const optionsHtml = Object.entries(quiz.options)
        .map(([key, value]) => `${key}. ${escapeHtml(value)}`)
        .join('<br>');
      return `<p><b>${index + 1}. ${question}</b><br>${optionsHtml}</p>`;
    }).join('');
    
    const hasAnyAnswer = quizzes.some(q => q.answer);
    let finalHtml = questionsHtml;

    if (hasAnyAnswer) {
      const answerListHtml = quizzes.map((quiz, index) => 
        `${String(index + 1).padStart(2, '0')}. ${quiz.answer ? escapeHtml(quiz.answer) : '___'}`
      ).join('<br>');
      finalHtml += `<p><br><b>Answers:</b><br>${answerListHtml}</p>`;
    }


    try {
      const htmlBlob = new Blob([finalHtml], { type: 'text/html' });
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const item = new (window as any).ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob,
      });
      navigator.clipboard.write([item]).then(() => {
        setIsDocsCopied(true);
        setTimeout(() => setIsDocsCopied(false), 2000);
      });
    } catch (error) {
      console.error('Failed to copy rich text, falling back to plain text: ', error);
      handleCopy();
    }
  };

  const handleStartOver = () => {
    setFiles([]);
    setQuizzes([]);
    setError(null);
    setIsLoading(false);
    setProcessingStatus(null);
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
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">1. Upload Files</h2>
              <ImageUploader onFilesUpload={handleFilesUpload} files={files} onRemoveFile={handleRemoveFile} />
            </div>
            
            {files.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">2. Process & Review</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Click the button to extract questions from all files. You can edit the results on the right.</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleProcessFiles}
                    disabled={isLoading || files.length === 0}
                    className="w-full flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? (processingStatus || 'Processing...') : `Extract Quizzes (${files.length})`}
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
                   <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyToDocs}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      title="Copy with formatting for Google Docs or Word"
                    >
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      {isDocsCopied ? 'Copied!' : 'Copy for Docs'}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      title="Copy as plain text"
                    >
                      <CopyIcon className="w-4 h-4 mr-2" />
                      {isCopied ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                )}
            </div>
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">{processingStatus || 'AI is analyzing your files...'}</p>
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
