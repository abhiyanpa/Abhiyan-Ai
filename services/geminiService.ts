
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types";

// Always initialize the client using the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const sendMessage = async (
  messages: Message[],
  onChunk?: (chunk: string) => void
): Promise<string> => {
  try {
    const contents = messages.map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const config = {
      systemInstruction: "You are Abhiyan AI, a state-of-the-art, hyper-fast AI companion. Your goal is to provide instantaneous, clear, and high-impact responses. You are direct, intelligent, and efficient. Use professional Markdown formatting.",
    };

    if (onChunk) {
      // Switched to Gemini Flash Lite for the absolute fastest response times on the free tier.
      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-flash-lite-latest', 
        contents,
        config
      });
      let fullText = "";
      for await (const chunk of streamResponse) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          onChunk(text);
        }
      }
      return fullText;
    } else {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents,
        config
      });
      return response.text || "";
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
