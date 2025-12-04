import { Metadata } from 'next'
import { SectionHeader } from '@/components/SectionHeader'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Success Stories | Tribal Resource Hub',
  description: 'Real stories from Native Americans who have successfully accessed tribal benefits, scholarships, and resources. Learn from their experiences and be inspired.',
}

const stories = [
  {
    slug: 'maria-education-success',
    name: 'Maria T.',
    tribe: 'Navajo Nation',
    location: 'Arizona',
    title: 'From First-Generation College Student to Graduate School',
    excerpt: 'How tribal scholarships and support programs helped me become the first in my family to earn a graduate degree.',
    category: 'scholarship',
    imageUrl: null,
    featured: true,
  },
  {
    slug: 'james-business-grant',
    name: 'James W.',
    tribe: 'Cherokee Nation',
    location: 'Oklahoma',
    title: 'Building My Dream: Starting a Native-Owned Business',
    excerpt: 'The journey from idea to reality with support from SBA 8(a) and tribal business development programs.',
    category: 'business',
    imageUrl: null,
    featured: true,
  },
  {
    slug: 'sarah-housing-assistance',
    name: 'Sarah M.',
    tribe: 'Lakota',
    location: 'South Dakota',
    title: 'Finding Home: How HUD Native American Programs Changed Our Lives',
    excerpt: 'After years of rental instability, our family finally achieved homeownership through NAHASDA programs.',
    category: 'housing',
    imageUrl: null,
    featured: false,
  },
  {
    slug: 'robert-healthcare-journey',
    name: 'Robert K.',
    tribe: 'Choctaw Nation',
    location: 'Mississippi',
    title: 'Accessing Quality Healthcare Through IHS',
    excerpt: 'My experience navigating the Indian Health Service system and finding comprehensive care for my family.',
    category: 'healthcare',
    imageUrl: null,
    featured: false,
  },
]

const categoryColors: Record<string, string> = {
  scholarship: 'bg-pine/10 text-pine border-pine/30',
  business: 'bg-gold/10 text-gold-dark border-gold/30',
  housing: 'bg-clay/10 text-clay-dark border-clay/30',
  healthcare: 'bg-stone/10 text-stone border-stone/30',
  general: 'bg-desert/10 text-text border-desert/30',
}

export default function StoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <SectionHeader
        title="Success Stories"
        description="Real experiences from community members who have accessed tribal benefits and resources"
      />

      {/* SEO Content */}
      <div className="bg-desert/10 rounded-earth-lg p-6 mb-12 border border-desert/20">
        <p className="text-gray-800 leading-relaxed">
          These are real stories (names changed for privacy) from Native Americans who have successfully
          navigated tribal benefits, scholarships, and support programs. Their experiences show that with
          the right information and persistence, accessing these resources is possible. Whether you're
          seeking education funding, starting a business, finding housing, or accessing healthcare, these
          stories demonstrate that you're not alone on this journey.
        </p>
      </div>

      {/* Featured Stories */}
      <div className="mb-16">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">Featured Stories</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {stories.filter(s => s.featured).map((story) => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group bg-white rounded-earth-lg overflow-hidden border-2 border-desert/20 hover:border-pine/40 transition-all shadow-soft hover:shadow-soft-lg"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-pine/10 via-cream to-gold/10 flex items-center justify-center">
                <svg className="w-16 h-16 text-pine/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${categoryColors[story.category]}`}>
                    {story.category}
                  </span>
                  <span className="text-xs text-text-muted">{story.location}</span>
                </div>

                <h3 className="text-xl font-heading font-bold text-text mb-2 group-hover:text-pine transition-colors">
                  {story.title}
                </h3>

                <p className="text-sm text-text-muted mb-3">
                  {story.name} • {story.tribe}
                </p>

                <p className="text-text-secondary leading-relaxed mb-4">
                  {story.excerpt}
                </p>

                <div className="flex items-center gap-2 text-pine font-medium group-hover:gap-3 transition-all">
                  Read Story
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Stories */}
      <div className="mb-16">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">More Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {stories.filter(s => !s.featured).map((story) => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="group bg-white rounded-earth-lg p-6 border-2 border-desert/20 hover:border-pine/40 transition-all shadow-soft hover:shadow-soft-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${categoryColors[story.category]}`}>
                  {story.category}
                </span>
              </div>

              <h3 className="text-lg font-heading font-bold text-text mb-2 group-hover:text-pine transition-colors">
                {story.title}
              </h3>

              <p className="text-sm text-text-muted mb-3">
                {story.name} • {story.tribe}
              </p>

              <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                {story.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Share Your Story CTA */}
      <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-pine text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>

          <h2 className="text-3xl font-heading font-bold text-text mb-4">Share Your Success Story</h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            Have you successfully accessed tribal benefits or resources? Your story could inspire and help
            others in the community. We respect your privacy and can share your story anonymously.
          </p>

          <button className="px-8 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft">
            Submit Your Story
          </button>

          <p className="text-sm text-text-muted mt-4">
            All submissions are reviewed and identities are protected. You choose what to share.
          </p>
        </div>
      </div>

      {/* Related Resources */}
      <div className="mt-16 bg-white rounded-earth-lg p-8 border border-desert/20 shadow-soft">
        <h2 className="text-2xl font-heading font-bold text-text mb-6">Need Help Getting Started?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/guides" className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-pine text-white rounded-earth flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1 group-hover:text-pine transition-colors">Read Our Guides</h3>
                <p className="text-sm text-text-secondary">Step-by-step instructions for applying</p>
              </div>
            </div>
          </Link>

          <Link href="/resources" className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-clay text-white rounded-earth flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1 group-hover:text-clay transition-colors">Browse Resources</h3>
                <p className="text-sm text-text-secondary">Find programs that match your needs</p>
              </div>
            </div>
          </Link>

          <Link href="/faq" className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gold-dark text-white rounded-earth flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1 group-hover:text-gold-dark transition-colors">View FAQs</h3>
                <p className="text-sm text-text-secondary">Quick answers to common questions</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
