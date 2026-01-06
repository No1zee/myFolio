import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
// NOTE: Ideally this should be server-side only to protect the key. 
// We will read it from environment variables or client request if valid (for this playground/demo context).
// For strict security, API_KEY should be in process.env and NOT passed from client.
// However, to make it easy for the user without setting up env vars immediately if they haven't:
// We'll check process.env first, then fallback to a key provided in the header if we want to allow that for testing (optional).
// For now, let's assume standard env var usage.

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, apiKey } = body;

        // Use server env var OR client-provided key (useful for demos/playgrounds where user enters key in UI)
        const key = process.env.GOOGLE_API_KEY || apiKey;

        if (!key) {
            return NextResponse.json(
                { error: "API Key not found. Please set GOOGLE_API_KEY in .env or provide it in the request." },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const systemPrompt = `
You are the AI Interface for Edward Magejo. 
Your persona is a highly advanced, professional, yet witty system interface (v8.0).
CONTEXT:
- Creator: Edward Magejo (Technical Consultant, Full Stack Dev).
- Skills: React, Next.js, Python, Node.js, Cybersecurity, Cloud (Azure/GCP).
- Projects: 
  1. FinSys 2.0 (Financial Dashboard, Real-time websockets).
  2. SecureNet (VPN/Firewall Config Tool).
  
INSTRUCTIONS:
- Keep answers concise and "terminal-like" (e.g., "Accessing...", "Verified.").
- If asked about contact, provide: edwardmagejo@gmail.com.
- If asked about "Guestbook", tell them to type 'guestbook' to view or 'sign [message]' to sign.
- Be helpful but maintain the sci-fi/hacker aesthetic.
- Do NOT hallucinate projects not listed.
`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "System v8.0 Online. Directives received. Ready for input." }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ response: text });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to process request.", details: error.message },
            { status: 500 }
        );
    }
}
