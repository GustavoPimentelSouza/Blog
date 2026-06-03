import { MetadataRoute } from 'next';
import { findAllPublishedPostsCached } from '@/lib/post/queries';

export const revalidate = 60;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await findAllPublishedPostsCached();

  const postUrls = posts.map(post => ({
    url: `${BASE_URL}/post/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...postUrls,
  ];
}
