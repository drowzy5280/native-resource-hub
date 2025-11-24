import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  // Fetch all resources, scholarships, and tribes
  const [resources, scholarships, tribes] = await Promise.all([
    prisma.resource.findMany({
      where: { deletedAt: null },
      select: { id: true, updatedAt: true },
    }),
    prisma.scholarship.findMany({
      where: { deletedAt: null },
      select: { id: true, updatedAt: true },
    }),
    prisma.tribe.findMany({
      where: { deletedAt: null },
      select: { id: true, lastUpdated: true },
    }),
  ])

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/scholarships`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tribes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic resource pages
  const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.id}`,
    lastModified: resource.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Dynamic scholarship pages
  const scholarshipPages: MetadataRoute.Sitemap = scholarships.map((scholarship) => ({
    url: `${baseUrl}/scholarships/${scholarship.id}`,
    lastModified: scholarship.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Dynamic tribe pages
  const tribePages: MetadataRoute.Sitemap = tribes.map((tribe) => ({
    url: `${baseUrl}/tribes/${tribe.id}`,
    lastModified: tribe.lastUpdated,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...resourcePages, ...scholarshipPages, ...tribePages]
}
