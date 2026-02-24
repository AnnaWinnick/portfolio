const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_TOP_TRACKS_URL = "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1";

interface SpotifyTrack {
  name: string;
  artist: string;
  url: string;
  albumArt: string | null;
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to refresh Spotify token");
    return null;
  }

  const data = await response.json();
  return data.access_token;
}

export async function getTopTrack(): Promise<SpotifyTrack | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const response = await fetch(SPOTIFY_TOP_TRACKS_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 86400 }, // refresh daily — top tracks don't change often
  });

  if (!response.ok) return null;

  const data = await response.json();
  const track = data.items?.[0];
  if (!track) return null;

  return {
    name: track.name,
    artist: track.artists.map((a: { name: string }) => a.name).join(", "),
    url: track.external_urls.spotify,
    albumArt: track.album.images?.[1]?.url ?? track.album.images?.[0]?.url ?? null,
  };
}
