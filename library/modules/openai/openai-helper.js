import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const selecteModel = "gpt-5";

export const AskBasic = async (userInputString) => {
  try {
    console.log(
      "[OPENAI-CREATE] starting OpenAI request for [AskBasic] with input :",
      userInputString
    );
    const response = await client.responses.create({
      model: selecteModel,
    //   tools: [{ type: "web_search" }],
      input: userInputString,
    });
    console.log(
      "[OPENAI-RESPONSE] ",
      `${response.status} - ${response.model} - ${response.output_text}`
    );
    if (response.status === "completed") return response.output_text;
  } catch (e) {
    console.log(
      "[OPENAI-ERROR] error processing OpenAI request for [AskBasic]",
      e
    );
  }
};
