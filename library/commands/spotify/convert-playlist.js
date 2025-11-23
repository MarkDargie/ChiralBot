import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import {
  GetUserPlaylistTracks,
  GetUserPlaylist,
} from "../../modules/spotify/spotify-helper.js";
import {
  TrackHeaders,
  MapTracksArray,
} from "../../modules/spotify/spotify-mapper.js";
import { ConvertObjectArrayToCSV } from "../../utils/csv-converter.js";

export default {
  // Define the slash command
  data: new SlashCommandBuilder()
    .setName("spotify-playlist-convert")
    .setDescription("Convert Spotify playlist tracks to specified file type")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Specify Playlist Id")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("filetype")
        .setDescription("File type to convert playlist tracks")
        .setRequired(true)
        .addChoices({ name: "Csv", value: "csv" })
    ),

  // This runs when the command is used
  async execute(interaction) {
    try {
      // Track total number of tracks and pagination state
      let totalTracks = 0;
      let currentOffset = 0;
      let playlistTracks = [];
      const limit = 100; // Spotify max limit per request

      // Read options from the slash command
      const playlistId = interaction.options.getString("id");

      // Get basic playlist info (name, owner, track count, etc.)
      const playlist = await GetUserPlaylist(playlistId);

      // Build a safe filename from playlist name + owner id
      const playlistFileName = `${playlist.name.replace(
        /[^a-zA-Z0-9 ]/g,
        ""
      )}-${playlist.owner?.id ?? ""}`;

      // Total number of tracks in this playlist
      totalTracks = playlist.tracks.total;

      // Let the user know we’ve started processing
      await interaction.reply({
        content: `Processing ${totalTracks} tracks from ${playlist.name.replace(
          /[^a-zA-Z0-9 ]/g,
          ""
        )}`,
      });

      console.log(
        `[Processing] - ${totalTracks} tracks from ${playlist.name.replace(
          /[^a-zA-Z0-9 ]/g,
          ""
        )}`
      );

      // Paginate through all tracks until we’ve collected them all
      while (playlistTracks.length < totalTracks) {
        // Get a chunk of tracks using limit + offset
        const newTracks = await GetUserPlaylistTracks(
          playlistId,
          limit,
          currentOffset
        );

        // If we got items back, append them to our main list
        if (newTracks?.items?.length > 0) {
          playlistTracks = playlistTracks.concat(newTracks.items);
          // Move offset forward by how many tracks we’ve collected
          currentOffset = playlistTracks.length;
        }
      }

      // Only proceed if we actually have tracks
      if (playlistTracks.length > 0) {
        // Map raw Spotify track objects into a flat array of objects
        // and convert that array to CSV
        const tracks = ConvertObjectArrayToCSV(
          MapTracksArray(playlistTracks),
          TrackHeaders
        );

        // Turn CSV string into a buffer so Discord can send it as a file
        const buffer = Buffer.from(tracks, "utf8");

        // Create the attachment with a nice filename
        const attachment = new AttachmentBuilder(buffer, {
          name: `${playlistFileName}.csv`,
        });

        // Send the CSV file back to the user
        await interaction.followUp({
          content: "Here is your playlist as a CSV 📄",
          files: [attachment],
        });
      }
    } catch (e) {
      // Log errors but don’t explode the bot
      console.log(
        "[ERROR] - Error processing request for user command - [spotify-playlist-convert]",
        e
      );
    }
  },
};

/*
⠀⠀⠀⠀⣠⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⡇⠀⠀⠀⠘⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣼⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⣡⣇⠀⠀⠀⠀⣧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣿⣿⠟⢻⣿⠤⠖⠒⠚⠉⠉⠉⠉⠉⠉⢩⡟⣹⠋⣿⠉⠉⠛⠒⣺⡤⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣿⡟⠀⢠⣿⡇⠀⢀⡄⠀⠀⠀⠀⠀⠀⣏⣼⣃⣠⣽⡤⠤⢴⠯⣭⠧⢼⣎⡳⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠈⣿⡇⠀⣼⣿⡇⠀⠰⣇⣠⡤⠴⠒⠚⠉⣿⠁⣤⣾⣿⡇⢀⣈⣉⣥⡤⢼⠬⣯⣛⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡄⠀⠀⠀⠀⠀
⠀⠀⠀⢻⣧⣼⣿⣿⠧⠒⠋⣏⣄⠀⠀⠀⠀⠀⢹⣀⡿⠿⠛⠉⠉⠁⠀⣀⣴⣾⠾⠓⠲⡯⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣞⣇⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣿⣿⣿⡟⠀⠀⠀⣇⡿⠃⣀⡤⠴⠚⢹⡇⠀⠀⣀⡠⠖⠚⠉⢀⣀⠤⠖⠚⣹⣋⣏⡟⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⢯⠏⢿⠀⠀⣄⠀⠀
⠀⠀⣴⣿⣿⣿⡟⠀⠀⠀⢀⡫⠖⠋⠁⠀⠀⣠⣤⣧⠴⠋⠁⠀⣀⡤⠚⠉⠀⠀⠀⣰⠃⡽⠣⣏⡧⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⠀⢸⣧⣴⣾⣀⠀⢸⡀⠀
⢀⣾⣿⣿⡿⢻⣷⢀⡤⠞⠉⠀⠀⠀⠀⢀⣼⣿⡿⠏⠀⣀⡴⠛⠁⠀⠀⠀⠀⢀⡴⠁⡴⠁⡼⢸⣷⢸⠀⠀⠀⠀⠈⣧⠀⠀⠀⣀⡠⠔⠚⠉⠁⠀⠀⠀⠈⡇⠉⠁⠀⠉⣑⣧⢄
⣼⣿⣿⠟⠀⣨⣿⣿⣿⣷⣦⡀⢀⣠⠖⠋⠀⠀⢀⣤⠞⠁⠀⠀⠀⠀⠀⣦⣠⠞⢶⡞⠣⣼⢁⡼⢁⡏⠀⠀⠀⠀⠀⢘⣧⠔⠋⠁⢀⡀⣀⡠⠴⠒⠚⢩⣽⡯⠉⠉⠉⠙⠷⠞⠤
⣿⣿⡏⠀⣾⣿⣿⣿⡿⢿⣿⣿⣏⠁⠀⠀⢠⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⢰⠛⢦⠎⢉⠿⣌⡞⢀⡞⠀⠀⠀⢀⡤⠚⠉⠘⣇⣀⠤⠚⣯⠁⠀⠀⣀⣤⠼⠟⠓⠒⠒⠒⠒⢓⠒⠒
⣿⣿⡇⠰⣿⣿⠁⢻⣧⠀⠹⣿⣿⠀⣠⠞⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢠⢯⣷⡏⢰⢿⢇⠞⠀⣀⠴⠚⠁⠀⢀⣠⡶⢻⡇⠀⢀⡸⡶⠚⠉⠀⢸⡓⣦⣠⠤⠤⠒⠒⢺⡂⢉
⠘⣿⣇⠀⢻⣿⣄⠈⣿⡆⠀⣿⣿⠞⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠱⣮⣸⣋⣰⣋⣤⠾⠒⠉⠀⣠⣆⡠⠖⠋⠹⠤⣞⠴⠚⠁⠀⢻⣀⡤⠖⠊⡏⢸⠇⠀⣀⠤⠔⠺⠟⠈
⠀⠘⢿⣷⣄⡈⠛⠛⢸⣿⣾⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢾⣠⠇⢠⠋⠀⣀⣠⣾⡟⡏⠀⠀⣀⠴⠊⠁⠀⢀⡠⣶⣿⡇⠀⢀⣴⣾⠼⠚⠉⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠈⠙⠛⠿⠿⠟⢻⣯⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢾⢉⠏⠉⠉⠁⣻⢋⣤⡧⠴⠋⢷⡀⢀⡤⠚⠉⠀⠿⠿⣃⠴⠚⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣀⡀⠀⠈⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣽⠒⠠⠤⠔⣿⠛⠛⠁⠀⣀⡬⢿⠁⠀⠀⠀⣀⡴⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣰⣿⣿⣿⣆⠀⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⠦⣀⣀⣤⣿⣀⡠⠴⠊⠁⠀⢈⣧⣀⠴⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢻⣿⣿⣿⠟⢀⣼⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢧⡀⠈⠉⠁⠀⠀⠀⠀⢀⣠⡿⣻⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠛⠿⠿⠿⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠒⠲⠦⠶⠒⠚⠉⠁⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
*/
