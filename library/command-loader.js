const { Collection } = require("discord.js");
const fs = require("node:fs");               
const path = require("node:path");           

// Absolute path to the ./commands folder (relative to this file)
const commandsPath = path.join(__dirname, "./commands");

module.exports = {
  /**
   * Load all command files from subfolders of ./commands
   * and register them into the provided commandCollection.
   *
   * @param {Collection} commandCollection - The collection to store commands in.
   */
  LoadCommands(commandCollection) {
    try {
      // Read the contents of the commands directory (async)
      fs.readdir(commandsPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
          // If we can't read the folder, silently bail out
          // (you could log this if you want more visibility)
          return;
        }

        // Loop through everything inside ./commands
        for (const entry of entries) {
          // Only process subdirectories (e.g. ./commands/fun, ./commands/moderation)
          if (entry.isDirectory()) {
            const fullPath = path.join(commandsPath, entry.name);

            // Read all files inside that subdirectory (sync)
            // and only keep .js files
            const pathFiles = fs
              .readdirSync(fullPath)
              .filter((file) => file.endsWith(".js"));

            // Loop through each command file
            for (const file of pathFiles) {
              const filePath = path.join(fullPath, file);

              // Require the command module
              const command = require(filePath);

              // Command must export both `data` (SlashCommandBuilder) and `execute` (handler)
              if ("data" in command && "execute" in command) {
                // Use the command name as the key in the collection
                commandCollection.set(command.data.name, command);
              } else {
                // If command is malformed, warn but keep going
                console.log(
                  `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
              }
            }
          }
        }
      });
    } catch (e) {
      // Catch any unexpected errors thrown while loading commands
      console.log("Error loading commands", e);
    }
  },
};
