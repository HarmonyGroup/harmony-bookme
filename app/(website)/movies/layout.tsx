import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Movies & Cinema in Nigeria - Book Movie Tickets Online",
  description: "Watch the latest movies in theaters across Nigeria. Book movie tickets online for cinemas in Lagos, Abuja, Port Harcourt and other cities with Harmony Bookme.",
  keywords: ["movies Nigeria", "cinema Lagos", "movie tickets", "cinema Abuja", "Port Harcourt movies", "online movie booking"],
  openGraph: {
    title: "Movies & Cinema in Nigeria - Book Movie Tickets Online",
    description: "Watch the latest movies in theaters across Nigeria. Book movie tickets online for cinemas in Lagos, Abuja, Port Harcourt and other cities with Harmony Bookme.",
    type: "website",
    url: "https://harmonybookme.com/movies",
  },
};

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
