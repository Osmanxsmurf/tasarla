import { queryClient } from "./queryClient";

// API Helper functions for authenticated requests
export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to login");
  }

  const data = await res.json();
  return data;
}

export async function register(userData: {
  username: string;
  email: string;
  password: string;
  name?: string;
}) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to register");
  }

  const data = await res.json();
  return data;
}

export async function logout() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to logout");
  }

  // Clear any cached queries
  queryClient.clear();
  return true;
}

export async function getCurrentUser() {
  const res = await fetch("/api/auth/user", {
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to get current user");
  }

  const data = await res.json();
  return data.user;
}

// Favorites API
export async function addFavorite(track: {
  trackId: string;
  title: string;
  artist: string;
  albumArt?: string;
  source: string;
}) {
  const res = await fetch("/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(track),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add favorite");
  }

  // Invalidate favorites cache
  queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
  
  const data = await res.json();
  return data;
}

export async function removeFavorite(trackId: string) {
  const res = await fetch(`/api/favorites/${trackId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to remove favorite");
  }

  // Invalidate favorites cache
  queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
  
  const data = await res.json();
  return data;
}

// Play History API
export async function addPlayHistory(track: {
  trackId: string;
  title: string;
  artist: string;
  albumArt?: string;
  source: string;
}) {
  const res = await fetch("/api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(track),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add play history");
  }

  // Invalidate history cache
  queryClient.invalidateQueries({ queryKey: ["/api/history"] });
  
  const data = await res.json();
  return data;
}

// AI Chat API
export async function createChat() {
  const res = await fetch("/api/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages: [] }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create chat");
  }

  const data = await res.json();
  return data;
}

export async function sendChatMessage(chatId: number, message: string) {
  const res = await fetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to send message");
  }

  // Invalidate chat cache
  queryClient.invalidateQueries({ queryKey: ["/api/chats", chatId] });
  
  const data = await res.json();
  return data;
}
