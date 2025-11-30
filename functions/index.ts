import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { GoogleGenAI } from "@google/genai";

// Initialize Firebase Admin
initializeApp();

// NOTE: This backend function is an alternative to the client-side call in services/geminiService.ts.
// In a real production app, you would use this to hide your API key.
// The current frontend implementation uses client-side calls to work in the preview environment.

export const analyzeCode = functions.https.onCall(async (data, context) => {
  // 1. Validate Auth (Optional: Require user to be logged in)
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  // }

  const { code, mode } = data;

  if (!code || !mode) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "code" and "mode" arguments.');
  }

  // 2. Initialize Gemini
  // Use environment variable for the key in Cloud Functions
  const apiKey = process.env.GEMINI_API_KEY; 
  if (!apiKey) {
      throw new functions.https.HttpsError('internal', 'API Key not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Construct Prompt
  let prompt = "";
  let systemInstruction = "You are a world-class senior software engineer.";

  switch (mode) {
    case 'Explain Code':
      prompt = `Explain this code:\n\n${code}`;
      break;
    case 'Find Bugs':
      prompt = `Find bugs in this code:\n\n${code}`;
      systemInstruction += " Focus on security and correctness.";
      break;
    case 'Improve Code':
      prompt = `Improve this code:\n\n${code}`;
      break;
    default:
      prompt = `Analyze this code:\n\n${code}`;
  }

  try {
    // 4. Call API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    // 5. Return Result
    return {
      result: response.text || "No response."
    };

  } catch (error) {
    console.error("Gemini Error", error);
    throw new functions.https.HttpsError('internal', 'Failed to analyze code.');
  }
});
