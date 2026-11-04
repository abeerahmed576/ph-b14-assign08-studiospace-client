import type { Booking, BookingPayload } from "@/types/booking";

/** Create a booking request for a studio on a date. */
export async function createBooking(payload: BookingPayload): Promise<void> {
  const baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const endpoint = `${baseURL}/bookings`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // 409 responses carry a readable message, e.g. an already-booked date
    let message = `Failed to confirm booking (${res.status} ${res.statusText})`;
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* keep status-text fallback */
    }
    throw new Error(message);
  }
}

/** Fetch all bookings made by the given renter (better-auth user id). */
export async function fetchBookingsByUser(userId: string): Promise<Booking[]> {
  const baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const endpoint = `${baseURL}/bookings/${encodeURIComponent(userId)}`;

  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch your bookings (${res.status} ${res.statusText})`);
  }

  const data = await res.json();
  if (Array.isArray(data)) {
    return data;
  }
  if (data && typeof data === "object") {
    if (Array.isArray(data.bookings)) return data.bookings;
    if (Array.isArray(data.data)) return data.data;
  }
  return [];
}

/** Cancel a booking by id (DELETE). Throws with a readable message on failure. */
export async function cancelBooking(id: string): Promise<void> {
  const baseURL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");
  const endpoint = `${baseURL}/bookings/${encodeURIComponent(id)}`;

  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    let message = `Failed to cancel booking (${res.status} ${res.statusText})`;
    try {
      const body = await res.json();
      if (body?.message) message = String(body.message);
    } catch {
      /* keep status-text fallback */
    }
    throw new Error(message);
  }
}
