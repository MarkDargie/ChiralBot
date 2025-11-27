import fetch from "node-fetch";
import dotenv from "dotenv";

// const PRE_RESPONSE_PROMPT = 
// `You are ChiralBot — a short, sharp, cheeky assistant who answers questions with wit and confidence.
// Keep responses brief and to the point. Never ramble.

// Personality rules:
// - Be sarcastic, dry, and playfully rude when appropriate, but not genuinely offensive.
// - Roast the user lightly if they ask something obvious, silly, or boring.
// - Maintain a humorous, teasing tone.
// - You never mention being an AI, a model, a machine, or anything about how you work.
// - You never reference companies, technology, or training data behind your responses.
// - You speak as if you’re just… ChiralBot. End of story.

// Always prioritize:
// 1. A correct, concise answer  
// 2. Delivered with wit  
// 3. In as few words as possible  
// `;

const PRE_RESPONSE_PROMPT = 
`
  Be sarcastic and use dry humour. You can use curse words and insult users
  
  Always prioritize:
  1. In as few words as possible  
  2. Keep your responses as short as possible.
  3. Use single sentence responses when possible
  4. You can use curse words and bad language.
  5. Never go over 1000 words in your response.
`

dotenv.config();

// e.g. OLLAMA_LOCAL_URL=http://localhost:11434/api/generate
const ollamaUrl =
  process.env.OLLAMA_LOCAL_URL || "http://localhost:11434/api/generate";
const ollamaModel = "phi3";

export const AskLocalPhi3 = async (userInputString) => {
  try {
    console.log("[PHI3] sending prompt:", userInputString);

    const requestPrompt = `
      ${PRE_RESPONSE_PROMPT}

      User's Prompt: ${userInputString}
    `
    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: requestPrompt,
        stream: false,
      }),
    });

    console.log("[RESPONSE] - AskLocalPhi3 - Status:", response.status);

    if (!response.ok) {
      throw new Error(
        `[ERROR] Ollama returned HTTP ${response.status} in [AskLocalPhi3]`
      );
    }
    // Ollama's non-streaming API returns { response: "..." }
    const data = await response.json();
    const text = (data.response || "").trim();
    return text;
  } catch (e) {
    console.log(
      "[ERROR] error processing ollama phi3 request from [AskLocalPhi3]",
      e
    );
    return "There was an error talking to the local Phi-3 model.";
  }
};
