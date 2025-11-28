// import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";

// export default {
//   cooldown: 10,
//   // Slash command data that gets registered with Discord
//   data: new SlashCommandBuilder()
//     .setName("remind") // /ask
//     .setDescription("Set reminders...")
//     .addStringOption(
//       (option) =>
//         option
//           .setName("reminder")
//           .setDescription("Content of the reminder")
//           .setRequired(true) // user must provide a question
//     )
//     .addStringOption(
//       (option) =>
//         option.setName("date").setDescription("dd-mm-yyyy").setRequired(true) // user must provide a question
//     )
//     .addIntegerOption((option) => {
//       option.setName("time").setDescription("0-23").setRequired(true); // TODO - can we define limits ?
//     }),

//   async execute(interaction) {
//     try {
//       if (interaction) {
//         console.log("[REMINDER] Processing Reminder: ", interaction.options);
//       }
//     } catch (e) {
//       console.log("[ERROR] Error processing user command - [remind]", e);
//     }
//   },
// };
