import fetch from "node-fetch";
import dotenv from "dotenv";

/*
⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣤⣶⣶⣶⣶⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⣤⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀
⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀
⠀⢀⣾⣿⡿⠿⠛⠛⠛⠉⠉⠉⠉⠛⠛⠛⠿⠿⣿⣿⣿⣿⣿⣷⡀⠀
⠀⣾⣿⣿⣇⠀⣀⣀⣠⣤⣤⣤⣤⣤⣀⣀⠀⠀⠀⠈⠙⠻⣿⣿⣷⠀
⢠⣿⣿⣿⣿⡿⠿⠟⠛⠛⠛⠛⠛⠛⠻⠿⢿⣿⣶⣤⣀⣠⣿⣿⣿⡄
⢸⣿⣿⣿⣿⣇⣀⣀⣤⣤⣤⣤⣤⣄⣀⣀⠀⠀⠉⠛⢿⣿⣿⣿⣿⡇
⠘⣿⣿⣿⣿⣿⠿⠿⠛⠛⠛⠛⠛⠛⠿⠿⣿⣶⣦⣤⣾⣿⣿⣿⣿⠃
⠀⢿⣿⣿⣿⣿⣤⣤⣤⣤⣶⣶⣦⣤⣤⣄⡀⠈⠙⣿⣿⣿⣿⣿⡿⠀
⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣾⣿⣿⣿⣿⡿⠁⠀
⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀
⠀⠀⠀⠀⠈⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠈⠙⠛⠛⠿⠿⠿⠿⠛⠛⠋⠁⠀⠀⠀⠀⠀⠀⠀
**/

// Load environment variables from .env
dotenv.config();

// Spotify app credentials from env
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Cached access token + expiry timestamp (ms)
let accessToken = null;
let tokenExpiresAt = 0;

// Check whether we have a token and it's still valid
const CheckValidAccessToken = () => {
  const now = Date.now();
  return accessToken && now < tokenExpiresAt;
};

// Get (or refresh) an app-level access token using Client Credentials flow
export const GetAccessToken = async () => {
  // Reuse token if still valid
  if (CheckValidAccessToken()) return accessToken;

  // Build Basic auth header: base64(clientId:clientSecret)
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

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

  // Store token + expiry (minus a small safety buffer)
  accessToken = data.access_token;
  // expires_in is in seconds
  tokenExpiresAt = now + (data.expires_in - 30) * 1000; // 30s safety margin

  return accessToken;
};

// Get full playlist metadata (name, owner, tracks info, etc.)
export const GetUserPlaylist = async (playlistId) => {
  const accessToken = await GetAccessToken();

  console.log(`[GET] - User Playlist: ${playlistId}`);

  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("[RESPONSE] - Playlist - Response Status:", res.status);

  if (!res.ok)
    throw new Error(`[ERROR] - Error getting spotify playlist - ${playlistId}`);

  return res.json();
};

// Get tracks for a playlist, with limit + offset for pagination
export const GetUserPlaylistTracks = async (playlistId, limit, offset) => {
  const accessToken = await GetAccessToken();

  console.log(`[GET] - User Playlist Tracks: ${playlistId}`);

  // Build query string params for limit/offset
  const params = new URLSearchParams();
  if (limit !== undefined) params.append("limit", String(limit));
  if (offset !== undefined) params.append("offset", String(offset));

  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  console.log("[RESPONSE] - Playlist Tracks - Response Status:", res.status);

  if (!res.ok)
    throw new Error(
      `[ERROR] - Error getting spotify playlist tracks - ${playlistId}`
    );

  return res.json();
};
