import fetch from "node-fetch";
import dotenv from "dotenv";

// System-style prompt that sets the model's behaviour/personality.
// This gets prepended to every user message you send to Phi-3.
const PRE_RESPONSE_PROMPT = `
  Be sarcastic and use dry humour. You can use curse words and insult users
  
  Always prioritize:
  1. In as few words as possible  
  2. Keep your responses as short as possible.
  3. Use single sentence responses when possible
  4. You can use curse words and bad language.
  5. Never go over 1000 words in your response.
`;

// Load environment variables from .env into process.env
dotenv.config();

// URL for your local Ollama server; falls back to localhost if env var is missing
const ollamaUrl =
  process.env.OLLAMA_LOCAL_URL || "http://localhost:11434/api/generate";

// Name/tag of the model you want Ollama to use
const ollamaModel = "phi3";

// Main helper function that sends a prompt to the local Phi-3 model via Ollama
export const AskLocalPhi3 = async (userInputString) => {
  try {
    console.log("[PHI3] sending prompt:", userInputString);

    // Build the final prompt that will be sent to the model:
    // - includes the persona/instructions
    // - plus the actual user message
    const requestPrompt = `
      ${PRE_RESPONSE_PROMPT}

      User's Prompt: ${userInputString}
    `;

    // Send a POST request to Ollama's /api/generate endpoint
    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,   // which model to run
        prompt: requestPrompt, // full text prompt
        stream: false,         // disable streaming for simpler handling
      }),
    });

    console.log("[RESPONSE] - AskLocalPhi3 - Status:", response.status);

    // If Ollama returns a non-2xx status, treat it as an error
    if (!response.ok) {
      throw new Error(
        `[ERROR] Ollama returned HTTP ${response.status} in [AskLocalPhi3]`
      );
    }

    // Ollama's non-streaming API returns JSON like: { response: "..." }
    const data = await response.json();
    const text = (data.response || "").trim();

    // Return the final text back to the caller (e.g. your Discord command)
    return text;
  } catch (e) {
    // Log any errors for debugging and return a safe fallback string
    console.log(
      "[ERROR] error processing ollama phi3 request from [AskLocalPhi3]",
      e
    );
    return "There was an error talking to the local Phi-3 model.";
  }
};
