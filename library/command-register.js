const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");

// set env config
dotenv.config();

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// Absolute path to the ./commands folder (relative to this file)
const commandsPath = path.join(__dirname, "./commands");

const commands = [];

module.exports = {
  async RegisterCommands() {
    try {
      // Read the contents of the commands directory (async)
      fs.readdir(commandsPath, { withFileTypes: true }, (err, entries) => {
        if (err) return;

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

              if ("data" in command && "execute" in command) {
                // Use the command name as the key in the collection
                commands.push(command.data.toJSON());
              } else {
                // If command is malformed, warn but keep going
                console.log(
                  `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
              }
            }
          }
        }
        // deploy commands to bot service via Routes & environment Guild & Client Ids
        (async () => {
          try {
            console.log(
              `Started refreshing ${commands.length} application (/) commands.`
            );

            // fully refresh all commands in the guild with the current set
            const data = await rest.put(
              Routes.applicationGuildCommands(
                process.env.CLIENT,
                process.env.GUILD
              ),
              { body: commands }
            );

            console.log(
              `Successfully reloaded ${data.length} application (/) commands.`
            );
          } catch (error) {
            console.error(error);
          }
        })();
      });
    } catch (e) {
      // Catch any unexpected errors thrown while registering commands
      console.log("Error registering commands", e);
    }
  },
};
