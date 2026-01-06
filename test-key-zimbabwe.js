const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
    console.log("🇿🇼 Testing API Key from Zimbabwe...");
    const apiKey = "AIzaSyCQw7ztsd21BUZMdaJElAhne23pZSpjYZc";

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Sending 'Hello' to Gemini...");
        const result = await model.generateContent("Hello friend, are you there?");
        const response = await result.response;
        console.log("✅ SUCCESS! Response:");
        console.log(response.text());
    } catch (error) {
        console.error("❌ FAILED:");
        console.error(error.message);

        if (error.message.includes("User location is not supported")) {
            console.log("\n📍 DIAGNOSIS: Regional Block. The API works, but not from Zimbabwe without a VPN.");
        } else if (error.message.includes("API key not valid") || error.message.includes("unregistered callers")) {
            console.log("\n🔑 DIAGNOSIS: Invalid API Key. The key itself is rejected.");
        }
    }
}

testKey();
