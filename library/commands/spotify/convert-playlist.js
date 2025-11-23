const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { GetUserPlaylistTracks } = require('../../modules/spotify/spotify-helper');
const { TrackHeaders, MapTracksArray} = require('../../modules/spotify/spotify-mapper');
const { ConvertObjectArrayToCSV } = require('../../utils/csv-converter');

// 6K3bTDHcoIuCYsdWsXlSXc

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spotify-playlist-convert')
        .setDescription('Convert Spotify playlist tracks to specified file type')
        .addStringOption((option) => option.setName('id').setDescription('Specify Playlist Id').setRequired(true))
        .addStringOption((option) => option.setName('filetype').setDescription('File type to convert playlist tracks').setRequired(true)
            .addChoices({name: 'Csv', value: 'csv'}))
        ,
    async execute(interaction) {
      try {
        const playlistId = interaction.options.getString("id");
        const playlistTracks = await GetUserPlaylistTracks(playlistId);

        if (playlistTracks && playlistTracks?.items?.length) {
          const tracks = ConvertObjectArrayToCSV(
            MapTracksArray(playlistTracks.items),
            TrackHeaders
          );

          const buffer = Buffer.from(tracks, "utf8");

          const attachment = new AttachmentBuilder(buffer, {
            name: "playlist_tracks.csv",
          });

          await interaction.reply({
            content: "Here is your playlist as a CSV 📄",
            files: [attachment],
          });
        }
      } catch (e) {
        console.log(
          "[ERROR] - Error processing request for user command - [spotify-playlist-convert]",
          e
        );
      }
    }
}