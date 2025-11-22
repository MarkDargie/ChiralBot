const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  ActivityType,
} = require("discord.js");
const dotenv = require("dotenv");

const { LoadCommands } = require("./library/command-loader");

// set env config
dotenv.config();

// Create a new client instance with intent permissions
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

// Set Collections
client.commands = new Collection();
const cooldowns = new Map();

// Command prefix checked in client.on messageCreate
const commandPrefix = "$";

// load all commands from /commands directories
LoadCommands(client.commands);

// runs once when client is ready
client.once(Events.ClientReady, (c) => {
  console.log(`ChiralBot - Link Established - Currently Logged in as ${c.user.tag}`);
  console.log("Listening...");

  //set client presence status
  client.user.setPresence({
    ctivities: [{ name: `$help`, type: ActivityType.Listening }],
  });
});

// Handle message reading & execute slash commands
client.on(Events.InteractionCreate, async (int) => {
  if (!int.isChatInputCommand()) return;

  const command = int.client.commands.get(int.commandName);

  if (!command) {
    console.error(`No command matching ${int.commandName} was found.`);
    return;
  }

  try {
    await command.execute(int);
  } catch (error) {
    
    console.error(error);

    if (int.replied || int.deferred) {
      await int.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await int.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
