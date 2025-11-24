import OpenAI from "openai";

// Create a reusable OpenAI client instance
// The API key must be available in process.env.OPENAI_API_KEY
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model to use for the request (typo in name is harmless, just a variable name)
const selecteModel = "gpt-5";

// Simple helper function to send a basic question to OpenAI
export const AskBasic = async (userInputString) => {
  try {
    // Log what we're about to send for easier debugging
    console.log(
      "[OPENAI-CREATE] starting OpenAI request for [AskBasic] with input :",
      userInputString
    );

    // Create a completion/response using the Responses API
    const response = await client.responses.create({
      model: selecteModel,
      // tools: [{ type: "web_search" }], // optional tools if you want web search later
      input: userInputString, // the user's question / message
    });

    // Log some info about the response so you can see what's happening
    console.log(
      "[OPENAI-RESPONSE] ",
      `${response.status} - ${response.model} - ${response.output_text}`
    );

    // Only return text if the response completed successfully
    if (response.status === "completed") return response.output_text;
  } catch (e) {
    // Catch and log any errors so they don't crash the bot
    console.log(
      "[OPENAI-ERROR] error processing OpenAI request for [AskBasic]",
      e
    );
  }
};
