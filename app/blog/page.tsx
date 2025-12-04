import { Metadata } from 'next'
import { SectionHeader } from '@/components/SectionHeader'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'News & Updates | Tribal Resource Hub',
  description: 'Latest news, updates, and announcements about Native American resources, benefits, scholarships, and programs.',
}

export const dynamic = 'force-dynamic'

const categories = [
  { id: 'all', label: 'All Posts', color: 'bg-stone/10 text-stone border-stone/30' },
  { id: 'news', label: 'News', color: 'bg-pine/10 text-pine border-pine/30' },
  { id: 'policy', label: 'Policy Updates', color: 'bg-clay/10 text-clay border-clay/30' },
  { id: 'deadline', label: 'Deadlines', color: 'bg-gold/10 text-gold-dark border-gold/30' },
  { id: 'community', label: 'Community', color: 'bg-desert/20 text-text border-desert/40' },
]

const categoryColors: Record<string, string> = {
  news: 'bg-pine/10 text-pine-dark border-pine/30',
  policy: 'bg-clay/10 text-clay-dark border-clay/30',
  deadline: 'bg-gold/10 text-gold-dark border-gold/30',
  community: 'bg-desert/20 text-text border-desert/40',
  updates: 'bg-stone/10 text-stone border-stone/30',
}

export default async function BlogPage() {
  // Fetch published blog posts from database
  const allPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      author: true,
      publishedAt: true,
      imageUrl: true,
      featured: true,
    },
  })

  const featuredPosts = allPosts.filter(post => post.featured)
  const regularPosts = allPosts.filter(post => !post.featured)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <SectionHeader
        title="News & Updates"
        description="Stay informed about the latest resources, policy changes, and opportunities"
      />

      {/* SEO Content */}
      <div className="bg-desert/10 rounded-earth-lg p-6 mb-12 border border-desert/20">
        <p className="text-gray-800 leading-relaxed">
          Stay up-to-date with the latest news about Native American resources, federal policy changes,
          new scholarship opportunities, and program expansions. We track important deadlines, announce
          new benefits, and share success stories from the community. Subscribe to our updates to never
          miss important information about resources available to Native American and Indigenous communities.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-earth border-2 transition-all font-medium ${category.color} hover:scale-105`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">Featured Posts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-earth-lg overflow-hidden border-2 border-desert/20 hover:border-pine/40 transition-all shadow-soft hover:shadow-soft-lg"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-pine/10 via-cream to-gold/10 flex items-center justify-center">
                <svg className="w-16 h-16 text-pine/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${categoryColors[post.category]}`}>
                    {post.category}
                  </span>
                  <span className="text-xs text-text-muted">
                    {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-text mb-2 group-hover:text-pine transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-text-secondary leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{post.author}</span>
                  <div className="flex items-center gap-2 text-pine font-medium group-hover:gap-3 transition-all">
                    Read More
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">Recent Posts</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-earth-lg p-6 border-2 border-desert/20 hover:border-pine/40 transition-all shadow-soft hover:shadow-soft-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${categoryColors[post.category]}`}>
                  {post.category}
                </span>
              </div>

              <h3 className="text-lg font-heading font-bold text-text mb-2 group-hover:text-pine transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed mb-3 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="text-xs text-text-muted">
                {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup CTA */}
      <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-pine text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-3xl font-heading font-bold text-text mb-4">Never Miss an Update</h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            Get the latest news, deadline reminders, and new resource announcements delivered to your inbox.
            Stay informed about opportunities that matter to you and your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-earth border-2 border-desert/60 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20"
            />
            <button className="px-6 py-3 bg-pine text-white rounded-earth font-semibold hover:bg-pine-dark transition-colors shadow-soft">
              Subscribe
            </button>
          </div>

          <p className="text-xs text-text-muted mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
