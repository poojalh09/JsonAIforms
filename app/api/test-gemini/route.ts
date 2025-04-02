import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not set' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Simple test prompt
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{
        role: "user",
        parts: [{ text: "Say 'Hello, the API is working!'" }]
      }]
    });

    return NextResponse.json({ 
      status: 'success',
      message: response.text
    });
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to Gemini API',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
