const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const SPOTIFY_RECENTLY_PLAYED_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

interface SpotifyTrack {
  name: string;
  artist: string;
  url: string;
  isPlaying: boolean;
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

export async function getNowPlaying(): Promise<SpotifyTrack | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  // Try currently playing first
  const nowPlayingResponse = await fetch(SPOTIFY_NOW_PLAYING_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (nowPlayingResponse.status === 200) {
    const data = await nowPlayingResponse.json();
    if (data.item) {
      return {
        name: data.item.name,
        artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
        url: data.item.external_urls.spotify,
        isPlaying: data.is_playing,
      };
    }
  }

  // Fall back to recently played
  const recentResponse = await fetch(SPOTIFY_RECENTLY_PLAYED_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (recentResponse.ok) {
    const data = await recentResponse.json();
    if (data.items?.[0]?.track) {
      const track = data.items[0].track;
      return {
        name: track.name,
        artist: track.artists.map((a: { name: string }) => a.name).join(", "),
        url: track.external_urls.spotify,
        isPlaying: false,
      };
    }
  }

  return null;
}
