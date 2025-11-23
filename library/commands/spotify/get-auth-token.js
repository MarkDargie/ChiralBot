const { SlashCommandBuilder } = require('discord.js');
const { GetAccessToken } = require('../../modules/spotify/spotify-helper');

module.exports = {
    data: new SlashCommandBuilder().setName('spotify-token').setDescription('Gets spotify auth token'),
    async execute(interaction) {
        const token = await GetAccessToken();
        if(token){
            await interaction.reply(
                `Spotify Access Token: ${token}`,
            );
        } else {
            await interaction.reply(
                `spotify access token not found...`,
            );
        }

    }
}