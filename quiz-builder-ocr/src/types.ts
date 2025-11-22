
export interface Quiz {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer?: string;
}

// Type for the expected raw response from Gemini
export interface GeminiQuizResponse {
  quizzes: Omit<Quiz, 'id'>[];
}