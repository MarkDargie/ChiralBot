const { Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {

    // TODO - restructure this to auto loop through each directory in /commands
    LoadCommands(commandCollection){
        try
        {  
            // Set command file path variables
            const commandsPath = path.join(__dirname, './commands/utils');
            //const eggCommandsPath = path.join(__dirname, '../commands/eastereggs');
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            //const eggCommandFiles = fs.readdirSync(eggCommandsPath).filter(file => file.endsWith('.js'));
    
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                console.log("Command loaded: ", filePath);
                // Set a new item in the Collection with the key as the command name and the value as the exported module
                if ('data' in command && 'execute' in command) {
                    commandCollection.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
            
            // for (const file of eggCommandFiles) {
            //     const filePath = path.join(eggCommandsPath, file);
            //     const command = require(filePath);
            //     console.log("Command loaded: ", filePath);
            //     // Set a new item in the Collection with the key as the command name and the value as the exported module
            //     if ('data' in command && 'execute' in command) {
            //         commandCollection.set(command.data.name, command);
            //     } else {
            //         console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            //     }
            // }

            return commandCollection;
        }
        catch(e)
        {
            console.log("Error loading commands.", e);
        }

    }

}