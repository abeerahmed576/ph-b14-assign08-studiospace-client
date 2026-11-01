import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Studio Space"
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
