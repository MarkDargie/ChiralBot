import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import config from "../../../config/config.json" with { type: "json" };


export default {
    cooldown: 10,
    data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask ChiralBot...'),
    async execute(interaction){
        try{
            
        }
        catch(e){
            console.log('[ERROR] Error processing user command - [ask]', e)
        }

    }
}