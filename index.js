const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require("discord.js");
const dotenv = require("dotenv");

const {LoadCommands} = require('./library/command-loader');

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
    console.log(`DargieBotV3 Ready ! - Currently Logged in as ${c.user.tag}`);
    console.log("Listening for commands...");

    //set client presence status
    client.user.setPresence({
        ctivities: [{ name: `$help`, type: ActivityType.Listening }]
    });
}); 

// Handle message reading & execute commands
client.on('messageCreate', msg => {

    if(!msg.content.startsWith(commandPrefix)) return;

    // main message handle logic
    try {
        if(msg.content.startsWith(commandPrefix)){
            const args = msg.content.slice(commandPrefix.length).trim().split(/ +/g);
            const commandName = args.shift();
            const command = client.commands.get(commandName.toLowerCase());

            if(!command) return msg.reply({content: UnknownCommand});

            // if collection are required, call alt execute method
            if(command.collectionsRequired)
            {
                return command.execute(msg, client, args);
            }

            // default execute commands
            return command.execute(msg, client, args);
        }
    }
    catch(e){
        console.log("Error reading messages: ", e);
    }
});


// Log in to Discord with your client's token
client.login(process.env.TOKEN);

