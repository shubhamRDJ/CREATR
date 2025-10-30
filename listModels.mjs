// listModels.mjs
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  const url = "https://generativelanguage.googleapis.com/v1beta/models";
  
  const response = await fetch(`${url}?key=${GEMINI_API_KEY}`);
  const data = await response.json();

  if (data.models) {
    console.log("✅ Available Gemini Models:");
    data.models.forEach(m => console.log(" -", m.name));
  } else {
    console.error("❌ Error fetching models:", data);
  }
}

listModels().catch(console.error);
