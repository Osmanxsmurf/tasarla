// Interfaces for Last.fm API responses
export interface LastFmArtistInfo {
  artist: {
    name: string;
    mbid: string;
    url: string;
    image: LastFmImage[];
    streamable: string;
    ontour: string;
    stats: {
      listeners: string;
      playcount: string;
    };
    similar: {
      artist: LastFmArtist[];
    };
    tags: {
      tag: LastFmTag[];
    };
    bio: {
      links: {
        link: {
          "#text": string;
          rel: string;
          href: string;
        };
      };
      published: string;
      summary: string;
      content: string;
    };
  };
}

export interface LastFmArtist {
  name: string;
  url: string;
  image: LastFmImage[];
}

export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega";
}

export interface LastFmTag {
  name: string;
  url: string;
}

export interface LastFmSimilarTracks {
  similartracks: {
    track: LastFmTrack[];
    "@attr": {
      artist: string;
    };
  };
}

export interface LastFmSimilarArtists {
  similarartists: {
    artist: LastFmArtist[];
    "@attr": {
      artist: string;
    };
  };
}

export interface LastFmTrack {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: {
    "#text": string;
    fulltrack: string;
  };
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image: LastFmImage[];
}

export interface LastFmTopTags {
  toptags: {
    tag: LastFmTag[];
    "@attr": {
      total: number;
      page: number;
      perPage: number;
    };
  };
}

// Function to get similar tracks
export async function getSimilarTracks(artist: string, track: string) {
  const res = await fetch(
    `/api/lastfm/similar?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to get similar tracks");
  }

  const data: LastFmSimilarTracks = await res.json();
  return data;
}

// Function to get similar artists
export async function getSimilarArtists(artist: string) {
  const res = await fetch(
    `/api/lastfm/similar?artist=${encodeURIComponent(artist)}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to get similar artists");
  }

  const data: LastFmSimilarArtists = await res.json();
  return data;
}

// Function to get artist info
export async function getArtistInfo(artist: string) {
  const res = await fetch(
    `/api/lastfm/artistinfo?artist=${encodeURIComponent(artist)}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to get artist info");
  }

  const data: LastFmArtistInfo = await res.json();
  return data;
}

// Function to get top genres
export async function getTopGenres() {
  const res = await fetch("/api/lastfm/topgenres", {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to get top genres");
  }

  const data: LastFmTopTags = await res.json();
  return data;
}

// Function to format Last.fm artist results
export function formatLastFmArtists(results: LastFmSimilarArtists) {
  return results.similarartists.artist.map(artist => ({
    name: artist.name,
    url: artist.url,
    image: artist.image.find(img => img.size === "large")?.["#text"] || ""
  }));
}

// Function to format Last.fm track results
export function formatLastFmTracks(results: LastFmSimilarTracks) {
  return results.similartracks.track.map(track => ({
    title: track.name,
    artist: track.artist.name,
    url: track.url,
    image: track.image.find(img => img.size === "large")?.["#text"] || ""
  }));
}
