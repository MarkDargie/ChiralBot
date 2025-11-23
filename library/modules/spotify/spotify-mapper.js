const TrackHeaders = ["index", "artist", "song", "album", "released"];

const MapTracksArray = (tracks) => {
  if (!tracks || tracks?.length == 0) return [];

  return tracks.map((item, index) => {
    return {
      index: index,
      artist: item?.track?.artists[0]?.name ?? "",
      song: item?.track?.name ?? "",
      album: item?.track?.album?.name ?? "",
      released: item?.track?.album?.release_date ?? "",
    };
  });
};

module.exports = {
  TrackHeaders,
  MapTracksArray,
};
