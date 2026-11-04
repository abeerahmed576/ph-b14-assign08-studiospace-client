import type { BookingPayload } from "@/types/booking";

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
