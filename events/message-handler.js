import { Collection, Events, Message, MessageFlags } from "discord.js";
import {
  CheckUrl,
  ConvertMessageUrl,
} from "../library/utils/xurl-converter.js";

export default {
  // This handler listens for every new message created in any guild/channel
  name: Events.MessageCreate,

  // `interaction` here is actually a Message object (Discord.js Message)
  async execute(interaction) {
    try {
      // Basic null/undefined safety check
      if (interaction) {
        // Store some useful info from the original message
        const originalMessageId = interaction.id;
        const originalMessageContent = interaction.content;
        let convertedUrl = undefined;

        // Check if the message content matches whatever URL pattern we care about
        if (CheckUrl(originalMessageContent)) {
          // If it does, convert/transform the URL in the message
          convertedUrl = ConvertMessageUrl(originalMessageContent);
        }

        // If we got a valid converted URL back
        if (convertedUrl) {
          // Reply to the original message with the converted URL
          await interaction.reply({ content: `${convertedUrl}` });

          // Delete the original message after replying
          // (Bot must have permission to manage/delete messages in that channel)
          await interaction.delete();
        }
      }
    } catch (e) {
      // Log any errors that occur while processing the message
      console.error(
        "[ERROR] Error processing user message for handler [MessageCreate]",
        e
      );
    }
  },
};
