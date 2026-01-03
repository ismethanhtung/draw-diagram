
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeSketch(canvasDataUrl: string): Promise<string> {
    const base64Data = canvasDataUrl.split(',')[1];
    
    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: base64Data,
      },
    };

    const textPart = {
      text: "Look at this whiteboard sketch. Briefly describe what it is and suggest 3 ways to improve it or what to add next to make it a better diagram."
    };

    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text || "I couldn't analyze the image.";
  }
}
