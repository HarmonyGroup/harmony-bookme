import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events in Nigeria - Concerts, Conferences & Live Performances",
  description: "Discover amazing events happening near you. Book concerts, conferences, exhibitions, workshops, and live performances across Nigeria with Harmony Bookme.",
  keywords: ["events Nigeria", "concerts Lagos", "conferences Abuja", "exhibitions", "live performances", "workshops", "entertainment booking"],
  openGraph: {
    title: "Events in Nigeria - Concerts, Conferences & Live Performances",
    description: "Discover amazing events happening near you. Book concerts, conferences, exhibitions, workshops, and live performances across Nigeria with Harmony Bookme.",
    type: "website",
    url: "https://harmonybookme.com/events",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
