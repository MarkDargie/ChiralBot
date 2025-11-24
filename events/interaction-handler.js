import { Collection, Events, MessageFlags } from "discord.js";
// Import the Events enum (for event names) and MessageFlags (for things like ephemeral replies)

export default {
  // This handler listens for *any* interaction that happens (slash commands, buttons, etc.)
  name: Events.InteractionCreate,

  /**
   * Fired whenever an interaction is created.
   * Here we specifically handle chat input (slash) commands.
   *
   * @param {Interaction} interaction - The interaction payload from Discord.
   */
  async execute(interaction) {
    // Ignore anything that isn't a slash command (buttons, context menus, etc.)
    if (!interaction.isChatInputCommand()) return;

    const { cooldowns } = interaction.client;

    // Look up the command implementation from the client's command collection
    const command = interaction.client.commands.get(interaction.commandName);

    // If the command doesn't exist in our collection, log an error and bail
    if (!command) {
      console.error(
        `[ERROR] No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      if (!cooldowns.has(command.data.name)) {
        cooldowns.set(command.data.name, new Collection());
      }

      // logic for handling command cooldowns
      const now = Date.now();
      const timestamps = cooldowns.get(command.data.name);
      const defaultCooldownDuration = 5;
      const cooldownAmount =
        (command.cooldown ?? defaultCooldownDuration) * 1_000;

      // check timestamps for user command request
      if (timestamps.has(interaction.user.id)) {
        const expirationTime =
          timestamps.get(interaction.user.id) + cooldownAmount;

        // check expiration time
        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000);
          return interaction.reply({
            content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R> :alarm_clock:`,
            flags: MessageFlags.Ephemeral,
          });
        }
      }
      // set timestamp for interaction user
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
      // Execute the command's logic
      await command.execute(interaction);
    } catch (e) {
      // Log the error for debugging
      console.error('[ERROR] Error processing user message for handler [InteractionCreate]', e);
      // If we've already replied or deferred, we have to use followUp instead of reply
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          // Ephemeral = only visible to the user who ran the command
          flags: MessageFlags.Ephemeral,
        });
      } else {
        // First response path if nothing has been sent yet
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

/*
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠑⠲⢤⣀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠓⠦⣄⡀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⢀⠀⠀⠀⠰⡀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠠⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⠴⠛⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣀⠔⠉⠀⠀⠀⠀⠀⠀⠀⠀⢳⣆⡀⠀⠙⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣤⣻⡀⠀⠀⠀⠀⠀⣦⠀⠀⠀⠀⠀⣠⡴⠒⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣠⠞⠁⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣦⣀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⣿⠀⠀⠀⠀⢀⡙⢦⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠺⠓⠊⠉⠉⣲⠀⠈⡇⠀⠀⠀⠀⠀⣿⣿⡉⠉⠉⠑⠦⣳⡄⠀⠀⠉⠉⠉⠉⠛⠻⠿⠿⣿⣿⣿⣿⡄⠀⠀⠀⣿⠀⠀⠀⠀⠀⢻⠲⠿⣆⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠏⠀⣴⣿⡄⠀⠀⠀⢀⡏⠛⠃⠀⠀⠀⠀⠀⠙⠀⣠⡤⣤⣀⣠⠦⠀⠀⠀⠀⠀⣍⠻⣿⣄⠀⠀⢻⠀⠀⠀⠀⠀⠀⢇⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡸⠀⣼⣿⣿⣷⡀⠀⠀⢸⣇⠀⠀⠀⠀⠠⠄⠀⣰⡟⢉⣤⣤⡉⠁⠀⠀⠀⠀⠤⠀⠙⠁⢹⣿⣆⠀⢸⣧⡀⠀⠀⠀⠀⠸⡆⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢰⡇⣴⣿⣿⣿⣿⣧⡀⠀⢘⡟⠁⠀⠀⠀⠀⢀⡾⢻⡄⠸⣤⣌⣿⠀⠀⠀⠀⡄⠀⠀⣤⠀⣿⣿⣿⣆⢸⣿⣿⣦⡀⠀⠀⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣾⡜⢹⣿⣿⣿⣿⣿⣷⡀⠐⣧⡀⠀⢀⣴⠀⠈⠙⠲⠿⠶⠴⠾⠋⠀⠀⠐⠺⠆⠀⠀⠈⠀⣿⣿⣿⣿⣾⣿⣿⣿⣟⢦⡀⠀⠀⣇⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠟⠁⢸⣿⣿⣿⣿⣿⣿⣷⡄⣟⣁⣀⣀⣠⣤⣤⣤⣤⣤⣄⣀⣀⣀⣀⣀⣀⠀⠀⠀⣴⡖⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⢹⢦⡀⢸⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣦⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⢦⣸⠀⠙⢦⣧⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⣿⣿⡿⢻⡏⠉⠉⠈⠙⠲⢬⣗⡦⣄⠀⠀⠀⣠⠄⠀⠀⣹⠉⠉⢉⣟⣿⠟⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣆⣀⣠⣽⣦⣤⣤⣴⣶⣶
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡛⡄⠀⣸⠀⠀⣴⠞⢻⡽⢿⣾⣍⢾⣿⣦⠞⠁⠀⠀⠀⢿⣤⣶⡾⢛⣾⣿⣷⠶⣄⡀⠈⠉⢹⠙⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣇⣷⣿⠀⣿⠀⠀⢿⡄⢿⡴⢆⡷⠹⣎⢻⠅⠀⠀⠀⠀⢀⣴⣿⠏⣴⠏⣾⢰⠎⣳⢀⣿⠂⠀⢸⠀⠀⣾⣹⡟⢹⣿⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡏⢱⣿⡇⡟⠀⠀⠈⠳⢤⣉⣉⣤⡤⠟⠀⠀⠀⠀⠀⠀⣼⡿⠁⠀⠻⣄⣉⣓⣚⣣⡾⠃⠀⠀⢸⠀⢸⣿⠻⠃⡟⢿⣿⣧⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣇⣿⡿⢻⡇⠀⠀⠀⠀⣀⣀⡤⠀⠀⠀⠀⠀⠀⠀⠀⢀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⢰⢿⣿⡀⣰⠃⠈⢻⣿⣷⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⢿⣷⡈⠃⣠⠤⠒⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⢠⡄⠰⢤⣀⠀⠀⠀⠀⢸⣿⣿⢟⣵⠏⠀⠀⠸⣿⣿⣷⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣦⠉⠙⣇⠀⠀⠀⠀⢀⣤⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢲⢤⡁⠀⠌⠙⠲⢤⡀⡼⠋⠁⣹⠋⠀⠀⠀⠀⢻⣿⣿⣄⡀⠀⣀⣀⣀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢦⠀⣿⠀⢀⡤⠞⠉⠀⠀⠀⠀⠀⠀⢀⣤⣀⢀⣀⣀⡀⠀⠀⠀⠈⠀⠈⠳⢆⡀⠀⠀⢙⣧⣀⡞⡇⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⡿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣈⣻⣹⣦⣉⣤⣤⣤⣾⣄⠀⠀⠀⠀⠈⠻⣽⣵⣟⡿⠃⠀⠀⠀⠀⠀⢧⡀⠀⠙⢦⣠⠟⢀⡿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡇⠀⠀⠀⠀⠀⠈⠛⠋⡀⢀⣀⠀⢤⡀⠀⠀⠙⢆⠀⢠⡟⠀⣸⡁⢸⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣦⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠲⠶⣶⣉⣉⣉⣉⣉⢉⣉⣭⠭⠟⠛⠀⠀⠀⠈⢳⡟⣶⠋⢸⣿⣿⣿⣿⣶⣶⣤⠀⠀⠀⠀⠀⠀⠈⠻⢿⡄
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⣰⡏⣹⣿⣧⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⡿⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⢞⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡽⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣧⡉⡳⢦⣀⣀⠀⠀⠀⠀⣀⣠⣴⣾⢟⣵⣿⣿⣺⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠃⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠊⠀⠀⠈⠉⢟⡿⣻⣿⢿⣿⣽⡷⣿⣿⢞⡵⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡎⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⢾⠂⠀⢀⢴⢵⡿⣺⢟⣷⡷⣻⣾⣾⢟⣵⠋⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡞⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣀⣠⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢄⣶⣿⣷⡊⢘⢼⡵⣫⣠⢾⣝⡷⡻⠃⠀⠘⣯⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀
⣀⣤⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠔⢹⠃⠈⠳⣞⡿⢻⠞⣵⣫⣫⡾⠁⠀⠀⠀⣸⡿⢙⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣽⣿⣿⣿⣷⣤⣀⠀⠀⠀⠀
*/
