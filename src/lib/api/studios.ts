import type { Studio } from "@/types/studio";

export async function fetchStudios(category?: string): Promise<Studio[]> {
  const baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const endpoint = category
    ? `${baseURL}/studios?category=${encodeURIComponent(category)}`
    : `${baseURL}/studios`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Prevent aggressive caching so changes in category or listings are fresh
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch studios (${res.status} ${res.statusText})`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    if (Array.isArray(data.studios)) return data.studios;
    if (Array.isArray(data.data)) return data.data;
  }
  return [];
}

/** Fetch all studios owned by the given host email. */
export async function fetchUserStudios(email: string): Promise<Studio[]> {
  const baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const endpoint = `${baseURL}/studios/user/${encodeURIComponent(email)}`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch your listings (${res.status} ${res.statusText})`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    if (Array.isArray(data.studios)) return data.studios;
    if (Array.isArray(data.data)) return data.data;
  }
  return [];
}

/** Delete a studio listing by id. Throws with a readable message on failure. */
export async function deleteStudio(id: string): Promise<void> {
  const baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const endpoint = `${baseURL}/studios/${encodeURIComponent(id)}`;

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    let message = `Failed to delete studio (${res.status} ${res.statusText})`;
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* keep status-text fallback */
    }
    throw new Error(message);
  }
}

