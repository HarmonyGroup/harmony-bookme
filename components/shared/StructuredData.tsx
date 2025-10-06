import React from 'react';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
};

export default StructuredData;

// Predefined structured data schemas
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Harmony Bookme",
  "alternateName": "Bookme",
  "url": "https://harmonybookme.com",
  "description": "Book smarter and easier with Harmony Bookme. Discover and book events, movies, leisure activities, accommodations, and travel experiences across Nigeria.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://harmonybookme.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Harmony Bookme",
    "url": "https://harmonybookme.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://harmonybookme.com/assets/logo-wordmark-dark.png"
    }
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Harmony Bookme",
  "url": "https://harmonybookme.com",
  "logo": "https://harmonybookme.com/assets/logo-wordmark-dark.png",
  "description": "Nigeria's premier booking platform for events, movies, leisure activities, accommodations, and travel experiences.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": "https://harmonybookme.com/contact"
  },
  "sameAs": [
    "https://facebook.com/harmonybookme",
    "https://twitter.com/harmonybookme",
    "https://instagram.com/harmonybookme"
  ]
};

export const breadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const eventSchema = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  image?: string;
  url: string;
  price?: number;
  currency?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.name,
  "description": event.description,
  "startDate": event.startDate,
  "endDate": event.endDate,
  "location": {
    "@type": "Place",
    "name": event.location
  },
  "image": event.image,
  "url": event.url,
  "offers": event.price ? {
    "@type": "Offer",
    "price": event.price,
    "priceCurrency": event.currency || "NGN"
  } : undefined
});

export const movieSchema = (movie: {
  name: string;
  description: string;
  image?: string;
  url: string;
  genre: string[];
  duration?: string;
  rating?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Movie",
  "name": movie.name,
  "description": movie.description,
  "image": movie.image,
  "url": movie.url,
  "genre": movie.genre,
  "duration": movie.duration,
  "contentRating": movie.rating
});

export const accommodationSchema = (accommodation: {
  name: string;
  description: string;
  address: string;
  image?: string;
  url: string;
  price?: number;
  currency?: string;
  rating?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": accommodation.name,
  "description": accommodation.description,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": accommodation.address
  },
  "image": accommodation.image,
  "url": accommodation.url,
  "priceRange": accommodation.price ? `${accommodation.currency || "NGN"}${accommodation.price}` : undefined,
  "aggregateRating": accommodation.rating ? {
    "@type": "AggregateRating",
    "ratingValue": accommodation.rating,
    "reviewCount": 1
  } : undefined
});

