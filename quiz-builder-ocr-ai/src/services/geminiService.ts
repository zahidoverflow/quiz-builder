import { Quiz } from "../types";

export async function extractQuizzesFromImage(base64ImageData: string, mimeType: string): Promise<Omit<Quiz, 'id'>[]> {
  try {
    const response = await fetch('/api/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64ImageData, mimeType }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Request failed with status ${response.status}` }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const quizzes = await response.json();
    return quizzes;
  } catch (error) {
    console.error("Error calling backend service:", error);
    if (error instanceof Error) {
        // Re-throw the specific error message from the backend or network layer
        throw error;
    }
    throw new Error("An unknown error occurred while communicating with the server.");
  }
}
