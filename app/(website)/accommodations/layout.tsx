import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotels & Accommodations in Nigeria - Book Your Stay",
  description: "Find the perfect accommodation for your stay in Nigeria. Book hotels, shortlets, vacation rentals, and guest houses in Lagos, Abuja, Port Harcourt and other cities.",
  keywords: ["hotels Nigeria", "accommodations Lagos", "shortlets Abuja", "vacation rentals", "guest houses", "hotel booking Nigeria"],
  openGraph: {
    title: "Hotels & Accommodations in Nigeria - Book Your Stay",
    description: "Find the perfect accommodation for your stay in Nigeria. Book hotels, shortlets, vacation rentals, and guest houses in Lagos, Abuja, Port Harcourt and other cities.",
    type: "website",
    url: "https://harmonybookme.com/accommodations",
  },
};

export default function AccommodationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
