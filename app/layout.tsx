import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CreatiScout · Digital Employee Marketing Workspace",
  description:
    "Delegate work to digital employees and run KOL marketing end to end: brief → creators → content → launch → review.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen overflow-hidden bg-page text-ink">{children}</body>
    </html>
  );
}
