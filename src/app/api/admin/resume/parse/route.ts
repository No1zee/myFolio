import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Hardcode key as fallback if env fail
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCQw7ztsd21BUZMdaJElAhne23pZSpjYZc";
const genAI = new GoogleGenerativeAI(apiKey);

console.log(`API Key Configured: ${apiKey ? "YES (Length: " + apiKey.length + ")" : "NO"}`);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // 1. Prepare PDF as Inline Data (Base64)
        console.log("Reading PDF file...");
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        console.log(`PDF read. Size: ${buffer.length} bytes`);

        // 2. Prompt Gemini (Multimodal)
        console.log("Sending PDF to Gemini 3.0 Flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-3.0-flash" });

        const prompt = `
        You are a Resume Parser Agent. I have attached a PDF resume.
        Your goal is to extract structured data for a Portfolio Database.

        EXTRACT THE FOLLOWING SECTIONS INTO VALID JSON:
        1. "experience": Array of objects { role, company, location, startDate, endDate (or null if present), isCurrent (bool), description }.
           - For "description": Summarize key achievements into a markdown bullet list.
        2. "skills": Array of objects { category, items: string[] }.
           - Group skills logically (e.g., "Languages", "Frameworks", "Tools").
        3. "certifications": Array of objects { name, issuer, year, category (default "Core") }.
        4. "bio": A short professional summary (2-3 sentences based on the resume).

        Return ONLY the raw JSON object. Do not include markdown formatting like \`\`\`json.
        `;

        const parts = [
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: base64Data
                }
            },
            { text: prompt }
        ];

        const result = await model.generateContent(parts);
        const response = await result.response;
        console.log("Gemini response received.");
        const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedData = JSON.parse(jsonString);

        return NextResponse.json({ success: true, data: parsedData });

    } catch (error: any) {
        console.error("Resume Parsing Error Detailed:", error);

        const errorMessage = typeof error === 'string' ? error : (error.message || JSON.stringify(error));

        console.log("❌ full error message:", errorMessage);

        // Handle Regional Blocks
        if (errorMessage.includes("User location is not supported")) {
            return NextResponse.json({
                error: "Regional Restriction",
                details: "The Google Gemini API is currently unavailable in your region (e.g., EU/UK). Please try using a VPN."
            }, { status: 403 });
        }

        if (errorMessage.includes("unregistered callers") || errorMessage.includes("API Key")) {
            return NextResponse.json({
                error: "API Key Error",
                details: "The API Key is missing or invalid. Please check your configuration."
            }, { status: 403 });
        }

        return NextResponse.json({ error: "Failed to parse resume", details: errorMessage }, { status: 500 });
    }
}
