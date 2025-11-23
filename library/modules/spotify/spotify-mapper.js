// Column headers used for the CSV export
export const TrackHeaders = ["index", "artist", "song", "album", "released"];

// Map raw Spotify playlist track items into a flat array of simple objects
// suitable for CSV conversion
export const MapTracksArray = (tracks) => {
  // If no tracks, return empty array to avoid errors
  if (!tracks || tracks.length === 0) return [];

  // For each playlist item, build a flat object
  return tracks.map((item, index) => ({
    // Position of the track in the playlist
    index,
    // First artist's name (fallback to empty string if missing)
    artist: item?.track?.artists?.[0]?.name ?? "",
    // Track name
    song: item?.track?.name ?? "",
    // Album name
    album: item?.track?.album?.name ?? "",
    // Album release date
    released: item?.track?.album?.release_date ?? "",
  }));
};
