import Link from 'next/link'
import { SearchBar } from '@/components/SearchBar'
import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { AdUnit } from '@/components/GoogleAdsense'
import {
  getCachedFeaturedResources,
  getCachedUpcomingScholarships,
  getCachedResourceCounts,
  getCachedScholarshipCounts,
  getCachedTribeCount,
} from '@/lib/cache'

// Revalidate home page every 10 minutes (600 seconds)
export const revalidate = 600

export default async function Home() {
  // Optimize: Use cached data and run all queries in parallel
  const [recentResources, upcomingScholarships, resourceCounts, scholarshipCounts, tribeCount] =
    await Promise.all([
      getCachedFeaturedResources(6),
      getCachedUpcomingScholarships(4),
      getCachedResourceCounts(),
      getCachedScholarshipCounts(),
      getCachedTribeCount(),
    ])

  return (
    <div>
      {/* Hero Section with Sunrise Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-desert/20 via-gold/10 to-cream pattern-circles">
        <div className="absolute inset-0 bg-gradient-to-r from-clay/5 to-pine/5 opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Circular sun motif */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-gold to-clay rounded-full flex items-center justify-center shadow-soft-lg">
                  <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-gold to-clay rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-midnight mb-6 leading-tight">
              Tribal Resource Hub
            </h1>
            <p className="text-xl md:text-2xl text-midnight/70 mb-10 max-w-4xl mx-auto leading-relaxed">
              A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <SearchBar />
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <Link
                href="/resources?tags=emergency"
                className="px-6 py-3 bg-clay text-white rounded-earth-lg font-medium hover:bg-clay-dark transition-all shadow-soft hover:shadow-soft-lg"
              >
                Emergency Resources
              </Link>
              <Link
                href="/scholarships"
                className="px-6 py-3 bg-pine text-white rounded-earth-lg font-medium hover:bg-pine-dark transition-all shadow-soft hover:shadow-soft-lg"
              >
                Scholarships
              </Link>
              <Link
                href="/tribes"
                className="px-6 py-3 bg-midnight text-white rounded-earth-lg font-medium hover:bg-midnight-light transition-all shadow-soft hover:shadow-soft-lg"
              >
                Find Your Tribe
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/20">
            <div className="text-5xl font-heading font-bold text-pine mb-3">
              {resourceCounts.total}
            </div>
            <div className="text-midnight/60 font-medium">Resources Available</div>
          </div>
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/20">
            <div className="text-5xl font-heading font-bold text-clay mb-3">
              {scholarshipCounts.total}
            </div>
            <div className="text-midnight/60 font-medium">Scholarships</div>
          </div>
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/20">
            <div className="text-5xl font-heading font-bold text-gold-dark mb-3">
              {tribeCount}
            </div>
            <div className="text-midnight/60 font-medium">Tribes Listed</div>
          </div>
        </div>

      {/* Ad Unit */}
      <div className="mb-16 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {/* Recent Resources */}
      <section className="mb-16">
        <SectionHeader
          title="Recent Resources"
          description="Recently added programs and services"
          actionLabel="View All"
          actionHref="/resources"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              title={resource.title}
              description={resource.description}
              type={resource.type}
              tags={resource.tags}
              tribe={resource.tribe || undefined}
              state={resource.state}
              url={resource.url}
            />
          ))}
        </div>
      </section>

      {/* Ad Unit */}
      <div className="mb-16 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {/* Upcoming Scholarships */}
      <section className="mb-16">
        <SectionHeader
          title="Scholarships Closing Soon"
          description="Don't miss these upcoming deadlines"
          actionLabel="View All Scholarships"
          actionHref="/scholarships"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              id={scholarship.id}
              name={scholarship.name}
              description={scholarship.description}
              amount={scholarship.amount}
              deadline={scholarship.deadline}
              tags={scholarship.tags}
              url={scholarship.url}
            />
          ))}
        </div>
      </section>

      {/* Ad Unit */}
      <div className="mb-16 flex justify-center">
        <AdUnit adSlot="9740169936" adFormat="horizontal" style={{ minHeight: '100px', width: '100%', maxWidth: '970px' }} />
      </div>

      {/* Resource Categories */}
      <section>
        <SectionHeader
          title="Browse by Category"
          description="Find resources specific to your needs"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Education', icon: '📚', href: '/resources?tags=education' },
            { name: 'Health', icon: '🏥', href: '/resources?tags=health' },
            { name: 'Housing', icon: '🏠', href: '/resources?tags=housing' },
            { name: 'Emergency', icon: '🚨', href: '/resources?tags=emergency' },
            { name: 'Youth', icon: '👶', href: '/resources?tags=youth' },
            { name: 'Elders', icon: '👵', href: '/resources?tags=elders' },
            { name: 'Business', icon: '💼', href: '/resources?tags=business' },
            { name: 'Language', icon: '🗣️', href: '/resources?tags=language' },
          ].map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="bg-white rounded-earth p-6 text-center hover:shadow-lg transition-shadow border border-earth-sand/30"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <div className="font-medium text-earth-brown">{category.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
