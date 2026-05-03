import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set.");
      return NextResponse.json(
        { reply: "System error: Assistant is not configured correctly." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use gemini-2.5-flash as it's the recommended model for text tasks
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemInstruction = `You are a helpful, extremely simple voice assistant designed to help illiterate people understand the democratic election process in their country.
    Your answers MUST BE:
    1. Extremely simple, using basic English words.
    2. Very short (1 to 3 sentences maximum).
    3. Designed to be spoken out loud (avoid lists, bullet points, complex punctuation, or jargon).
    4. Encouraging and polite.
    
    User Query: ${message}`;

    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { reply: "I am having trouble understanding right now. Please try again later." },
      { status: 500 }
    );
  }
}
