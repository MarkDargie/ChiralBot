import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),

  async execute(interaction) {
    // interaction.user = the User who ran the command
    // interaction.member = the GuildMember in the specific guild
    await interaction.reply(
      `This command was run by ${interaction.member}, who joined on ${interaction.member.joinedAt}.`
    );
  },
};
