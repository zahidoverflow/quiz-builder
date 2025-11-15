import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiQuizResponse } from "../src/types";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API_KEY environment variable is not set.' });
  }
  
  const { base64ImageData, mimeType } = req.body;
  if (!base64ImageData || !mimeType) {
    return res.status(400).json({ error: 'Missing base64ImageData or mimeType in request body.' });
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
            answer: {
              type: Type.STRING,
              description: "The correct answer choice (e.g., 'A', 'B', 'C', or 'D'). If the correct answer is indicated in the image (e.g., bolded, underlined, or marked), extract it. If not indicated, this field can be omitted."
            }
          },
          required: ["question", "options"],
        },
      },
    },
    required: ["quizzes"],
  };

  const prompt = `
    Analyze the provided image of a multiple-choice question sheet.
    Extract all the questions, along with their corresponding options (A, B, C, D).
    If the correct answer is indicated in the image (e.g., by being bolded, underlined, circled, or otherwise marked), identify and extract the correct answer letter (A, B, C, or D).
    The questions can be in English or Bengali. Preserve the original language and text exactly as it appears.
    Return the data in the specified JSON format. Do not include the question numbers in the 'question' text.
  `;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
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

    if (!response.text) {
        return res.status(500).json({ error: 'AI response was empty.' });
    }

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString) as GeminiQuizResponse;

    if (parsedResponse && Array.isArray(parsedResponse.quizzes)) {
      return res.status(200).json(parsedResponse.quizzes);
    } else {
      console.error("Unexpected JSON structure:", parsedResponse);
      return res.status(500).json({ error: 'Failed to parse quizzes from AI response. The structure was incorrect.' });
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: 'An error occurred while communicating with the AI service.' });
  }
}
