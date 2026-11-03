import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Studio | StudioSpace",
};

export default function AddStudioPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">Add New Studio</h1>
        <p className="text-muted-foreground">List your creative space on StudioSpace.</p>
      </div>
      <div className="mt-8 p-8 bg-card border border-border rounded-2xl">
        <p className="text-sm text-muted-foreground">New studio listing form shell.</p>
      </div>
    </div>
  );
}

