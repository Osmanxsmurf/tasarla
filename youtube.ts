// Interfaces for YouTube API responses
export interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchItem[];
}

export interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: YouTubeThumbnail;
      medium: YouTubeThumbnail;
      high: YouTubeThumbnail;
    };
    channelTitle: string;
    liveBroadcastContent?: string;
    publishTime: string;
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

// Function to search YouTube
export async function searchYouTube(query: string, type: string = "video") {
  const res = await fetch(`/api/youtube/search?query=${encodeURIComponent(query)}&type=${type}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to search YouTube");
  }

  const data: YouTubeSearchResponse = await res.json();
  return data;
}

// Function to format YouTube results
export function formatYouTubeResults(results: YouTubeSearchResponse) {
  return results.items.map(item => ({
    id: item.id.videoId || "",
    title: item.snippet.title,
    artist: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.medium.url,
    source: "youtube"
  }));
}

// Function to get video URL
export function getYouTubeVideoUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// Function to get embed URL
export function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube.com/embed/${videoId}`;
}
