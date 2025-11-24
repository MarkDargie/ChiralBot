import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import config from "../../../config/config.json" with { type: "json" };
import { AskBasic } from "../../modules/openai/openai-helper.js";

export default {
  cooldown: 10,
  // Slash command data that gets registered with Discord
  data: new SlashCommandBuilder()
    .setName("ask") // /ask
    .setDescription("Ask ChiralBot...")
    .addStringOption((option) =>
      option
        .setName("question") // /ask question:<text>
        .setDescription("Question input to ask ChiralBot")
        .setRequired(true) // user must provide a question
    ),

  // Actual logic that runs when a user uses /ask
  async execute(interaction) {
    try {
      // Make sure the interaction exists and the user actually provided a question
      if (interaction && interaction.options.getString("question")) {
        // Immediately reply so Discord doesn't think the bot is dead
        await interaction.reply({ content: `thinking...` });

        // Grab the question string from the command options
        // and strip out anything that isn't a letter/number/space
        // (helps avoid weird characters / basic sanitization)
        const normalisedMessage = interaction
          .options
          .getString("question")
          .replace(/[^a-zA-Z0-9 ]/g, "");

        // Ask OpenAI (wrapped in your helper function)
        const openAiResponse = await AskBasic(normalisedMessage);

        // If we got a response back, send it to the user
        if (openAiResponse) {
          await interaction.followUp({
            content: `${openAiResponse}`,
          });
        }
      }
    } catch (e) {
      // Log any errors so you can debug what went wrong
      console.log("[ERROR] Error processing user command - [ask]", e);
    }
  },
};
