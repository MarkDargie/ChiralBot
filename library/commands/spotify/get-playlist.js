const { SlashCommandBuilder } = require('discord.js');
const { GetUserPlaylist } = require('../../modules/spotify/spotify-helper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify-playlist')
        .setDescription('Gets spotify auth token')
        .addStringOption((option) => option.setName('id').setDescription('Specify Playlist Id')),
    async execute(interaction) {

        const playlistId = interaction.options.getString("id");
        const playlist = await GetUserPlaylist(playlistId);

        if (playlist) {
          const playlistUrl = playlist.external_urls.spotify;
          await interaction.reply(`Spotify Playlist Found ${playlistUrl}`);
        }

    }
}