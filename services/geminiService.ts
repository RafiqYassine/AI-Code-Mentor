import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisMode } from "../types";

// NOTE: In a production Firebase environment, you might move this logic to a 
// Cloud Function to hide the process.env.API_KEY if strictly needed. 
// For this project, we use the client-side SDK as requested by the system instructions.

const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export interface AnalysisResult {
  markdown: string;
  code?: string;
}

export const analyzeCode = async (code: string, mode: AnalysisMode): Promise<AnalysisResult> => {
  if (!ai) {
    throw new Error("Gemini API Key is missing. Please set process.env.API_KEY.");
  }

  let prompt = "";
  let systemInstruction = "You are a world-class senior software engineer and code mentor. Your goal is to provide helpful, concise, and accurate analysis of code snippets.";
  
  // Base config
  let config: any = {
    systemInstruction: systemInstruction,
    temperature: 0.3,
  };

  if (mode === AnalysisMode.IMPROVE) {
    prompt = `Review the following code and suggest improvements for performance, readability, and best practices. Refactor the code.
    
    IMPORTANT: Return the response in JSON format with two fields:
    1. "improvedCode": The complete refactored code. Do NOT wrap this in markdown code blocks. Just the raw code.
    2. "explanation": A concise markdown explanation of the changes and why they were made.
    
    Code to improve:
    ${code}`;

    config.responseMimeType = "application/json";
    config.responseSchema = {
      type: Type.OBJECT,
      properties: {
        improvedCode: { type: Type.STRING },
        explanation: { type: Type.STRING },
      },
      required: ["improvedCode", "explanation"],
    };

  } else {
    // Original prompts for other modes
    switch (mode) {
      case AnalysisMode.EXPLAIN:
        prompt = `Explain the following code snippet in simple, easy-to-understand terms. Break down complex parts. Code:\n\n${code}`;
        break;
      case AnalysisMode.BUGS:
        prompt = `Analyze the following code for potential bugs, security vulnerabilities, and logical errors. If bugs are found, explain them and provide the corrected code. Code:\n\n${code}`;
        config.systemInstruction += " Focus strictly on correctness and safety.";
        break;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: config,
    });

    const responseText = response.text || "";

    if (mode === AnalysisMode.IMPROVE) {
      try {
        const json = JSON.parse(responseText);
        // Strip markdown fences just in case the model adds them inside the JSON string
        let cleanCode = json.improvedCode || "";
        if (cleanCode.startsWith("```")) {
          cleanCode = cleanCode.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/, '');
        }
        
        return {
          markdown: json.explanation || "No explanation provided.",
          code: cleanCode
        };
      } catch (e) {
        console.error("Failed to parse JSON response:", e);
        return { markdown: responseText }; // Fallback
      }
    }

    return { markdown: responseText };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze code. Please try again.");
  }
};