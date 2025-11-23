const { SlashCommandBuilder } = require('discord.js');
const { GetUserPlaylist } = require('../../modules/spotify/spotify-helper');

// 6K3bTDHcoIuCYsdWsXlSXc

module.exports = {
    data: new SlashCommandBuilder()
    .setName('spotify-playlist')
    .setDescription('Gets spotify auth token')
    .addStringOption((option) => option.setName('input').setDescription('Specify Playlist Id')),
    async execute(interaction) {

        const playlistId = interaction.options.getString("input");
        const playlist = await GetUserPlaylist(playlistId);

        if (playlist) {
          const playlistUrl = playlist.external_urls.spotify;
          await interaction.reply(`Spotify Playlist Found ${playlistUrl}`);
        }

    }
}