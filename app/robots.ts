import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/vendor/',
        '/auth/',
        '/api/',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: 'https://harmonybookme.com/sitemap.xml',
  }
}

