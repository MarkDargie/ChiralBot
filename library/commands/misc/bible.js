import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import config from "../../../config/config.json" with { type: "json" };
import BibleVerse from "bible-snippets";

export default {
    cooldown: 5,
    data: new SlashCommandBuilder()
    .setName("verse")
    .setDescription("Provides thee a verse from the holy bible."),
    async execute(interaction) {
        try{
            if(interaction){
                const bibleVerse = await new BibleVerse();
                const verse = await bibleVerse.getRandomVerse();

                const formattedVerse = {
                    reference: verse.reference,
                    verse: verse.text
                };

                if(formattedVerse.reference && formattedVerse.verse){

                    const formattedResponse = 
                    `
                        ${formattedVerse.reference} \n
                        ${formattedVerse.verse} \n
                        Christ is King :cross: :crown:  
                    `;

                    // await interaction.reply({
                    //     content:
                    //     `${bibleVerse}`
                    // })
                    console.log('[BIBLE] Bible Verse:', formattedResponse);
                }
            }
        }
        catch(e){
            console.log("[ERROR] error processing user command - [verse]", e);
        }
    }
}