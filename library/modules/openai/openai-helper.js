import OpenAI from "openai";

// Create a reusable OpenAI client instance
// The API key must be available in process.env.OPENAI_API_KEY
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Model to use for the request (typo in name is harmless, just a variable name)
const selecteModel = "gpt-5-nano";
const maxOutputTokens = 2500;
const effortOptions = ['low', 'medium','high'];
const errorResponseMesssage = "Sorry, I am unable to efficiently answer you as I have severe autism and I'm currently in sensory overload state.";

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
      reasoning: {"effort" : effortOptions[0]},
      input: userInputString, // the user's question / message
      max_output_tokens: maxOutputTokens,
      // tools: [{ type: "web_search" }], // optional tools if you want web search later
    });

    // Log some info about the response so you can see what's happening
    console.log(
      "[OPENAI-RESPONSE] ",
      `${response.status} - ${response.model} - ${response.output_text}`
    );

    // return output text if the response completed successfully
    if (response.status === "completed") return response.output_text;
    // return default message back on failure or incomplete responses
    if (response.status === "failed" || response.status === "incomplete") return errorResponseMesssage;
  } catch (e) {
    // Catch and log any errors so they don't crash the bot
    console.log(
      "[OPENAI-ERROR] error processing OpenAI request for [AskBasic]",
      e
    );
  }
};
