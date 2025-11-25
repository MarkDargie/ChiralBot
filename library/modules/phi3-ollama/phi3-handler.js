import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

// e.g. OLLAMA_LOCAL_URL=http://localhost:11434/api/generate
const ollamaUrl =
  process.env.OLLAMA_LOCAL_URL || "http://localhost:11434/api/generate";
const ollamaModel = "phi3";

export const AskLocalPhi3 = async (userInputString) => {
  try {
    console.log("[PHI3] sending prompt:", userInputString);

    const response = await fetch(ollamaUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: userInputString,
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
