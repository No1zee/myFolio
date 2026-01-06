import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// Hardcode removed for security. STRICTLY use env vars.
const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) console.error("FATAL: GEMINI_API_KEY is not set.");
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
    try {
        const { text, fieldType } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let specificInstruction = "";
        if (fieldType === 'bio') {
            specificInstruction = "Make this personal bio sound like a cool tech founder or indie hacker. Confident, brief, and impressive.";
        } else if (fieldType === 'role') {
            specificInstruction = "Make this job title sound modern and impactful.";
        } else if (fieldType === 'description') {
            specificInstruction = "Rewrite these bullet points to be punchy, results-oriented, and exciting. Use 'pitch deck' language. Keep it concise. CRITICAL: Ensure all verbs and actions are strictly in the PAST TENSE.";
        } else {
            specificInstruction = "Polish this text to be more professional yet casual and engaging.";
        }

        const prompt = `
        You are a Copywriting Expert for a Tech Portfolio.
        TASK: ${specificInstruction}
        
        INPUT TEXT:
        "${text}"

        OUTPUT:
        Return ONLY the rewritten text. No quotes, no markdown wrappers, no explanations. Just the polished text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const polishedText = response.text().trim();

        return NextResponse.json({ success: true, polishedText });

    } catch (error: any) {
        console.error("Polish API Error:", error);
        return NextResponse.json({ error: "Failed to polish text" }, { status: 500 });
    }
}
