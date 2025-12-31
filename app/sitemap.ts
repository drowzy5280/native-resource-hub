import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

// Revalidate sitemap every 24 hours
export const revalidate = 86400

// Static date for truly static pages (avoids generating new dates on each request)
const STATIC_DATE = new Date('2024-01-01')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://native-resource-hub.vercel.app'

  // Fetch all dynamic content in parallel
  const [resources, scholarships, tribes, guides, blogPosts, stories] = await Promise.all([
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
    prisma.resourceGuide.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.successStory.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ])

  // US States for state landing pages
  const usStates = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
    'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
    'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
    'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
    'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
    'new-hampshire', 'new-jersey', 'new-mexico', 'new-york',
    'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon',
    'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
    'west-virginia', 'wisconsin', 'wyoming',
  ]

  // Get the most recent update date from resources for dynamic list pages
  const latestResourceUpdate = resources.length > 0
    ? new Date(Math.max(...resources.map(r => r.updatedAt.getTime())))
    : STATIC_DATE
  const latestScholarshipUpdate = scholarships.length > 0
    ? new Date(Math.max(...scholarships.map(s => s.updatedAt.getTime())))
    : STATIC_DATE

  // Static pages with appropriate update dates
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestResourceUpdate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: latestResourceUpdate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/scholarships`,
      lastModified: latestScholarshipUpdate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tribes`,
      lastModified: STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/nonprofits`,
      lastModified: STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/grants`,
      lastModified: STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/eligibility-checker`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/stories`,
      lastModified: STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: STATIC_DATE,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: STATIC_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: STATIC_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic resource pages
  const resourcePages: MetadataRoute.Sitemap = resources.map((resource) => ({
    url: `${baseUrl}/resources/${resource.id}`,
    lastModified: resource.updatedAt,
    changeFrequency: 'weekly' as const,
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

  // Dynamic guide pages
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guide.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic blog pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Dynamic story pages
  const storyPages: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: story.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // State landing pages
  const statePages: MetadataRoute.Sitemap = usStates.map((state) => ({
    url: `${baseUrl}/resources/state/${state}`,
    lastModified: latestResourceUpdate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...resourcePages,
    ...scholarshipPages,
    ...tribePages,
    ...guidePages,
    ...blogPages,
    ...storyPages,
    ...statePages,
  ]
}
