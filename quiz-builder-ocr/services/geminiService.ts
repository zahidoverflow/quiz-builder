
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, GeminiQuizResponse } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    quizzes: {
      type: Type.ARRAY,
      description: "An array of all extracted quiz questions.",
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The full text of the question, preserving the original language (e.g., Bengali or English).",
          },
          options: {
            type: Type.OBJECT,
            properties: {
              A: { type: Type.STRING, description: "Option A text." },
              B: { type: Type.STRING, description: "Option B text." },
              C: { type: Type.STRING, description: "Option C text." },
              D: { type: Type.STRING, description: "Option D text." },
            },
            required: ["A", "B", "C", "D"],
          },
        },
        required: ["question", "options"],
      },
    },
  },
  required: ["quizzes"],
};

export async function extractQuizzesFromImage(base64ImageData: string): Promise<Omit<Quiz, 'id'>[]> {
  const prompt = `
    Analyze the provided image of a multiple-choice question sheet.
    Extract all the questions, along with their corresponding options (A, B, C, D).
    The questions can be in English or Bengali. Preserve the original language and text exactly as it appears.
    Return the data in the specified JSON format. Do not include the question numbers in the 'question' text.
  `;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64ImageData,
    },
  };

  const textPart = {
    text: prompt,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString) as GeminiQuizResponse;

    if (parsedResponse && Array.isArray(parsedResponse.quizzes)) {
      return parsedResponse.quizzes;
    } else {
      console.error("Unexpected JSON structure:", parsedResponse);
      throw new Error("Failed to parse quizzes from AI response. The structure was incorrect.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("An error occurred while communicating with the AI service.");
  }
}
