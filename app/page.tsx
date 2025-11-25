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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-earth-brown mb-6">
          Find Resources for Your Community
        </h1>
        <p className="text-xl text-earth-brown/70 mb-8 max-w-3xl mx-auto">
          Access federal programs, state resources, tribal services, and scholarships
          all in one place.
        </p>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-earth-lg p-6 text-center border border-earth-sand/30">
          <div className="text-4xl font-bold text-earth-teal mb-2">
            {resourceCounts.total}
          </div>
          <div className="text-earth-brown/70">Resources Available</div>
        </div>
        <div className="bg-white rounded-earth-lg p-6 text-center border border-earth-sand/30">
          <div className="text-4xl font-bold text-earth-rust mb-2">
            {scholarshipCounts.total}
          </div>
          <div className="text-earth-brown/70">Scholarships</div>
        </div>
        <div className="bg-white rounded-earth-lg p-6 text-center border border-earth-sand/30">
          <div className="text-4xl font-bold text-earth-tan mb-2">
            {tribeCount}
          </div>
          <div className="text-earth-brown/70">Tribes Listed</div>
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
