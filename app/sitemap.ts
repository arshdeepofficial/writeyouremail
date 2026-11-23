import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://writeyouremail.com';
  const lastModified = new Date();

  return [
    // 1. PRIMARY APP ROUTES
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/studio`,
      lastModified,
      changeFrequency: 'always', // Frequent updates due to 30-mode engine
      priority: 0.9,
    },
    
    // 2. GLENT SOVEREIGN INFRASTRUCTURE
    {
      url: `${baseUrl}/glent/passport`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glent`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/glent/ecosystem`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/glent/philosophy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/glent/governance`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/glent/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // 3. LEGAL & COMPLIANCE
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];
}