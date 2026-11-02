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

