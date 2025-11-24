import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { fileURLToPath, pathToFileURL } from "node:url";

// set env config
dotenv.config();

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN);

// Absolute path to the ./commands folder (relative to this file)
const commandsPath = path.join(__dirname, "./commands");

const commands = [];

export async function RegisterCommands() {
  try {
    // Read the contents of the commands directory (async)
    fs.readdir(commandsPath, { withFileTypes: true }, async (err, entries) => {
      if (err) {
        console.log("[ERROR] error reading commands directory:", err);
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
            const fileUrl = pathToFileURL(filePath).href;

            try {
              // Dynamically import the command module (ESM)
              const commandModule = await import(fileUrl);
              const command = commandModule.default ?? commandModule;

              if ("data" in command && "execute" in command) {
                // Push JSON form of the command for registration
                commands.push(command.data.toJSON());
              } else {
                // If command is malformed, warn but keep going
                console.log(
                  `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
                );
              }
            } catch (importError) {
              console.log(
                `[ERROR] Failed to load command at ${filePath}:`,
                importError
              );
            }
          }
        }
      }

      // deploy commands to bot service via Routes & environment Guild & Client Ids
      (async () => {
        try {
          console.log(
            `[PROCESS] Started refreshing ${commands.length} application (/) commands.`
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
            `[PROCESS] Successfully reloaded ${data.length} application (/) commands.`
          );
        } catch (error) {
          console.error(error);
        }
      })();
    });
  } catch (e) {
    // Catch any unexpected errors thrown while registering commands
    console.log("[ERROR] Error registering commands", e);
  }
}

/*
⠀⠀⠀⠀⠀⣠⡶⠟⠛⠻⢶⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠛⠛⠻⢶⣄⠀⠀⠀⠀
⠀⠀⠀⠀⣼⠏⠀⠀⠀⠀⠀⢹⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣠⣤⣤⣤⣤⣤⣤⣤⣤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⠋⠀⠀⠀⠀⠀⢻⡆⠀⠀⠀
⠀⣀⣤⠶⠿⠀⠀⠀⠀⠀⠀⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣴⠾⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠉⠙⠛⢶⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⡄⠀⠀⠀⠀⠀⠸⠷⠶⣤⡀
⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠙⢿⣄⠀⠀⠀⠀⠀⠀⠀⢀⣴⠟⠋⢀⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢙⠷⣦⡀⠀⠀⠀⠀⠀⠀⠀⣩⡿⠓⢀⠀⠀⠀⠀⠀⠀⠈⢻
⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣷⡄⠀⠀⠀⠀⣴⡟⠁⠀⣴⣿⠋⣶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠀⠀⣿⣮⠈⢻⣦⠀⠀⠀⠀⢠⣾⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸
⠹⣧⡀⠀⠀⠀⢠⣆⠀⠀⠀⠀⠀⠈⠻⣦⡀⢀⡾⠋⠀⣠⣾⠟⢡⣾⠟⢀⣼⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣷⡀⠈⢻⣦⡀⠻⣧⡀⣠⡼⠋⠁⠀⠀⠀⠀⠀⣀⠀⠀⠀⠀⢀⣼
⠀⠈⠻⠶⠶⠾⠛⠙⢷⣆⡀⠀⠀⠀⠀⠈⢹⡿⠁⠀⠀⡟⡁⠰⡿⠃⣠⢿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢙⢿⣄⠀⡹⣿⡄⢸⣿⡋⠀⠀⠀⠀⠀⢀⣴⡞⠋⠛⠶⠶⠶⠛⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢷⣤⡀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⠀⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠻⣦⡀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⣀⣈⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣛⣁⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡟⢯⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⠉⢻⡆⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠘⠿⠾⠶⠶⠶⠶⠶⠶⢶⣷⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⠶⣶⠶⠶⠶⠶⠶⠶⠶⠶⠟⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⡀⠀⠀⠀⠀⠀⠀⣠⣴⣾⣶⣶⣦⣀⠀⠀⠀⠀⠀⢀⠀⣠⣴⣾⣶⣶⣤⡀⠀⠀⠀⠀⠀⢰⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣧⠀⠀⠀⠀⢈⣾⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀⠀⢬⣾⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠠⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣾⡀⠀⠀⣹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⢰⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⢀⣸⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣥⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠈⠾⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠈⣰⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣮⠀⠀⠙⢿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⠟⠁⢀⣼⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⣤⡀⠀⠈⠉⡉⠉⠀⠀⠀⣠⣤⣤⣆⠀⠀⠀⠈⠉⠙⠉⠀⢀⣴⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢈⣿⣷⣄⣀⠀⠀⠀⠀⠀⠻⠿⠿⠛⠀⠀⠀⠀⠀⣀⣤⡾⣯⡑⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡶⠋⣱⡟⠈⠙⠻⢶⣦⣤⣤⣤⣤⣄⣤⣤⣤⢶⡾⠛⠋⠁⢿⡌⠻⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠀⢠⣿⣄⡀⠀⠀⣾⠀⠀⠀⠠⣹⡏⠀⠀⠀⢸⣇⠀⠀⢀⣼⣷⠀⠈⠻⢦⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⡾⠋⠀⠀⢀⢸⡇⠉⠛⠳⢦⣿⣄⣀⣀⣀⣸⣇⣀⣀⣠⣬⣿⠶⠞⠋⠁⢼⡆⠀⠀⠀⠙⢷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣠⡶⠶⠳⠶⣦⣴⠞⠋⠀⠀⠀⠀⢸⣸⣯⡀⠀⠀⢰⡇⠈⠉⠉⠉⣹⡏⠉⠉⠁⠀⣿⠀⠀⠀⢀⣼⡇⠀⠀⠀⠀⠀⠙⢷⣤⡴⠾⠳⠶⣦⡀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣼⠏⠀⠀⠀⠀⠘⠁⠀⠀⠀⠀⠀⣠⡿⢻⡏⠛⢶⣤⣸⣇⡀⠀⠀⠀⢸⡇⠀⠀⠀⢀⣻⣆⣤⠾⠋⣹⡿⣦⡀⠀⠀⠀⠀⠀⠉⠀⠀⠀⠀⠈⢻⡆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣿⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣼⠟⠣⢸⣇⠀⠀⠀⠛⠛⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠛⠛⠀⠀⠀⣼⠇⠘⢿⣇⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⡇⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠹⣧⣂⠀⠀⠀⠀⠀⠀⠀⠰⣿⡁⠀⠀⢪⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡿⡀⠀⠁⢩⡿⠂⠀⠀⠀⠀⢀⠀⠀⣴⣾⠃⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠛⠻⣾⠀⠀⠀⠀⠀⠀⢸⡷⠀⠀⠈⠹⣧⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡿⠃⠀⠀⠸⣿⡁⠀⠀⠀⠀⠀⢸⡷⠟⠋⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣆⠀⠀⠀⠀⢀⣼⠇⠀⠀⠀⠀⠙⢷⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣴⠟⠁⠀⠀⠀⠀⡹⣧⠀⠀⠀⠀⢀⣼⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠅⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⢙⡻⢶⠶⠶⢟⣁⠀⠀⠀⠀⠀⠀⠀⠈⣙⠳⠶⣤⣤⣤⣤⣤⣤⣤⡴⠶⣛⣋⠁⠀⠀⠀⠀⠀⠀⠁⢙⡻⠶⡶⠶⣟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/