const fetch = require("node-fetch").default;
const dotenv = require("dotenv");

// set env config
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiresAt = 0;

const CheckValidAccessToken = () => {
  const now = Date.now();
  return accessToken && now < tokenExpiresAt;
};

const GetAccessToken = async () => {
  // Reuse token if still valid
  if (CheckValidAccessToken()) return accessToken;

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) throw new Error("Error getting spotify auth token");

  const data = await res.json();

  const now = Date.now();

  accessToken = data.access_token;
  // expires_in is in seconds
  tokenExpiresAt = now + (data.expires_in - 30) * 1000; // 30s safety margin
  return accessToken;
};

const GetUserPlaylist = async (playlistId) => {
  const accessToken = await GetAccessToken();

  console.log(`Getting User Playlist: ${playlistId}`);

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("Get Playlist - Response Status: ", res.status);

  if (!res.ok)
    throw new Error(`Error getting spotify playlist - ${playlistId}`);

  const data = await res.json();
  return data;
};

const GetUserPlaylistTracks = async (playlistId) => {
  const accessToken = await GetAccessToken();

  console.log(`Getting User Playlist Tracks: ${playlistId}`);

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("Get Playlist Tracks - Response Status: ", res.status);

  if (!res.ok)
    throw new Error(`Error getting spotify playlist tracks - ${playlistId}`);

  const data = await res.json();

  console.log('--- TRACKS: ', data);

  return data;

};

module.exports = {
  GetAccessToken,
  GetUserPlaylist,
  GetUserPlaylistTracks
};
