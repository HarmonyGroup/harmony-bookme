import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./../globals.css";
import Providers from "../providers";
import Navbar from "@/components/website/shared/Navbar";
import Footer from "@/components/website/shared/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Harmony Bookme - Book Events, Movies, Leisure & Accommodations",
    template: "%s | Harmony Bookme"
  },
  description: "Book smarter and easier with Harmony Bookme. Discover and book events, movies, leisure activities, accommodations, and travel experiences across Nigeria.",
  keywords: ["booking platform", "events", "movies", "leisure", "accommodations", "travel", "Nigeria", "entertainment booking"],
  authors: [{ name: "Harmony Bookme" }],
  creator: "Harmony Bookme",
  publisher: "Harmony Bookme",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://harmonybookme.com",
    siteName: "Harmony Bookme",
    title: "Harmony Bookme - Book Events, Movies, Leisure & Accommodations",
    description: "Book smarter and easier with Harmony Bookme. Discover and book events, movies, leisure activities, accommodations, and travel experiences across Nigeria.",
    images: [
      {
        url: "/assets/logo-wordmark-dark.png",
        width: 1200,
        height: 630,
        alt: "Harmony Bookme Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harmony Bookme - Book Events, Movies, Leisure & Accommodations",
    description: "Book smarter and easier with Harmony Bookme. Discover and book events, movies, leisure activities, accommodations, and travel experiences across Nigeria.",
    images: ["/assets/logo-wordmark-dark.png"],
  },
  icons: {
    icon: "/assets/bookme-icon.png",
    apple: "/assets/bookme-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased relative`}>
        <Providers>
          <Navbar />
          <div>{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}