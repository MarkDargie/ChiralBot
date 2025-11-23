const {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  ActivityType,
} = require("discord.js");
const dotenv = require("dotenv");
const fs = require("node:fs");
const path = require("node:path");

const commandsPath = path.join(__dirname, "./library/commands/");
const { LoadCommands } = require("./library/command-loader.js");
const { RegisterCommands } = require("./library/command-register.js");

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
// register all commands to guild from /commands directories
RegisterCommands();

// Build an absolute path to the ./events folder (where all your event files live)
const eventsPath = path.join(__dirname, 'events');
// Read all files in the events folder and only keep the .js ones
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	// Full path to the current event file
	const filePath = path.join(eventsPath, file);

	// Import the event module (should export: name, execute, and optionally once)
	const event = require(filePath);

	// If the event should only fire once (e.g. ready), use client.once
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		// Otherwise, attach a regular listener that fires every time the event occurs
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(process.env.TOKEN);
