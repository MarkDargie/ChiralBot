import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import config from "../../../config/config.json" with { type: "json" };
import { AskBasic } from "../../modules/openai/openai-helper.js";
import { AskLocalPhi3 } from "../../modules/phi3-ollama/phi3-handler.js";

export default {
  cooldown: 10,
  // Slash command data that gets registered with Discord
  data: new SlashCommandBuilder()
    .setName("ask") // /ask
    .setDescription("Ask ChiralBot...")
    .addStringOption((option) =>
      option
        .setName("agent") // select which agent to use
        .setDescription("Choose which AI agent to use.")
        .setRequired(true)
        .addChoices({ name: "GPT", value: "GPT" }, {name:'PHI3', value: 'PHI3'})
    )
    .addStringOption((option) =>
      option
        .setName("question") // /ask question:<text>
        .setDescription("Question text input.")
        .setRequired(true) // user must provide a question
    ),

  // Actual logic that runs when a user uses /ask
  async execute(interaction) {
    try {

      // Make sure the interaction exists and the user actually provided a question
      if(interaction && interaction.options.getString("question")){

        // Grab the question string from the command options
        // and strip out anything that isn't a letter/number/space
        const normalisedMessage = interaction
          .options
          .getString("question")
          .replace(/[^a-zA-Z0-9 ]/g, "");

        // handle GPT-OPENAI requests
        if(interaction.options.getString("agent") === "GPT" && normalisedMessage) {
            // Immediately reply so Discord doesn't think the bot is dead
            await interaction.reply({ content: `thinking...` });

            // Ask OpenAI (wrapped in your helper function)
            const openAiResponse = await AskBasic(normalisedMessage);

            // If we got a response back, send it to the user
            if (openAiResponse) {
              await interaction.followUp({
                content: `${openAiResponse}`,
              });
            }
        }
        // handle PHI3-OLLAMA / CHIRAL requests
        if(interaction.options.getString("agent") === "PHI3" && normalisedMessage){
            // Immediately reply so Discord doesn't think the bot is dead
            await interaction.reply({ content: `thinking...` });

            const ollamaResponse = await AskLocalPhi3(normalisedMessage);

            // If we got a response back, send it to the user
            if (ollamaResponse) {
              await interaction.followUp({
                content: `${ollamaResponse}`,
              });
            }
        }
      }
    } catch (e) {
      // Log any errors so you can debug what went wrong
      console.log("[ERROR] Error processing user command - [ask]", e);
    }
  },
};
