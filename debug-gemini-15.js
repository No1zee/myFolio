const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testConnection() {
    console.log("Testing Gemini 1.5 Flash...");
    // Hardcoded key from user
    const apiKey = "AIzaSyCQw7ztsd21BUZMdaJElAhne23pZSpjYZc";

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        console.log("Sending prompt...");
        const result = await model.generateContent("Reply with 'Pong' if you receive this.");
        const response = await result.response;
        console.log("Response:", response.text());
        console.log("✅ API Connection Success!");
    } catch (error) {
        console.error("❌ API Error:", error.message);
    }
}

testConnection();
