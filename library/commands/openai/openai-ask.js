import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import config from "../../../config/config.json" with { type: "json" };
import { AskBasic } from "../../modules/openai/openai-helper.js";

export default {
    cooldown: 10,
    data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Ask ChiralBot...')
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Question input to ask ChiralBot")
        .setRequired(true)
    ),
    async execute(interaction){
        try{
            if(interaction && interaction.options.getString("question")){
                await interaction.reply({ content: `thinking...` });
                const normalisedMessage = interaction.options.getString("question").replace(/[^a-zA-Z0-9 ]/g,"");
                const openAiResponse = await AskBasic(normalisedMessage);

                if(openAiResponse){
                    await interaction.followUp({
                        content: `${openAiResponse}`,
                    });
                }
            }
        }
        catch(e){
            console.log('[ERROR] Error processing user command - [ask]', e)
        }
    }
}