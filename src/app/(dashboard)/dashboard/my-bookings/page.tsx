import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings | StudioSpace",
};

export default function MyBookingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          My Bookings
        </h1>
        <p className="text-muted-foreground">
          View your upcoming and past studio reservations.
        </p>
      </div>
    </div>
  );
}
