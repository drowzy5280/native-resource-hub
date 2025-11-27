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
import { Metadata } from 'next'
import { MountainsSilhouette, SunRays, TribalBorder, GeometricPattern } from '@/components/Patterns'
import {
  EducationIcon,
  HealthIcon,
  HousingIcon,
  EmergencyIcon,
  YouthIcon,
  EldersIcon,
  BusinessIcon,
  LanguageIcon,
} from '@/components/CategoryIcons'

// Revalidate home page every 10 minutes (600 seconds)
export const revalidate = 600

export const metadata: Metadata = {
  title: 'Home',
}

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
        {/* Background mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0 text-pine opacity-30">
          <MountainsSilhouette className="w-full h-48 sm:h-64" />
        </div>

        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 text-clay opacity-20">
          <GeometricPattern className="w-full h-full" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-clay/5 to-pine/5 opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="text-center">
            {/* Enhanced sun motif with rays */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                {/* Sun rays background */}
                <div className="absolute inset-0 -m-12 text-gold">
                  <SunRays className="w-32 h-32 sm:w-40 sm:h-40" />
                </div>

                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold to-clay rounded-full flex items-center justify-center shadow-soft-lg">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gold to-clay rounded-full animate-ping opacity-20"></div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-midnight mb-6 leading-tight px-2">
              Tribal Resource Hub
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-midnight/70 mb-10 max-w-4xl mx-auto leading-relaxed px-4">
              A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <SearchBar />
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-12 px-4">
              <Link
                href="/resources?tags=emergency"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-clay text-white rounded-earth-lg font-medium hover:bg-clay-dark transition-all shadow-soft hover:shadow-soft-lg text-sm sm:text-base min-h-[44px] flex items-center"
              >
                Emergency Resources
              </Link>
              <Link
                href="/scholarships"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-pine text-white rounded-earth-lg font-medium hover:bg-pine-dark transition-all shadow-soft hover:shadow-soft-lg text-sm sm:text-base min-h-[44px] flex items-center"
              >
                Scholarships
              </Link>
              <Link
                href="/tribes"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-midnight text-white rounded-earth-lg font-medium hover:bg-midnight-light transition-all shadow-soft hover:shadow-soft-lg text-sm sm:text-base min-h-[44px] flex items-center"
              >
                Find Your Tribe
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative border */}
      <div className="text-desert/40">
        <TribalBorder className="w-full h-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/20 relative overflow-hidden group">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 text-pine/10">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L64 0L64 64L32 32L0 0Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text-5xl font-heading font-bold text-pine mb-3">
              {resourceCounts.total}
            </div>
            <div className="text-midnight/60 font-medium">Resources Available</div>
          </div>
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/20 relative overflow-hidden group">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 text-clay/10">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L64 0L64 64L32 32L0 0Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text-5xl font-heading font-bold text-clay mb-3">
              {scholarshipCounts.total}
            </div>
            <div className="text-midnight/60 font-medium">Scholarships</div>
          </div>
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/20 relative overflow-hidden group">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 text-gold/10">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L64 0L64 64L32 32L0 0Z" fill="currentColor" />
              </svg>
            </div>
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
            { name: 'Education', icon: EducationIcon, color: 'text-pine', bgColor: 'bg-pine/5', href: '/resources?tags=education' },
            { name: 'Health', icon: HealthIcon, color: 'text-clay', bgColor: 'bg-clay/5', href: '/resources?tags=health' },
            { name: 'Housing', icon: HousingIcon, color: 'text-midnight', bgColor: 'bg-midnight/5', href: '/resources?tags=housing' },
            { name: 'Emergency', icon: EmergencyIcon, color: 'text-clay-dark', bgColor: 'bg-clay/5', href: '/resources?tags=emergency' },
            { name: 'Youth', icon: YouthIcon, color: 'text-gold-dark', bgColor: 'bg-gold/5', href: '/resources?tags=youth' },
            { name: 'Elders', icon: EldersIcon, color: 'text-pine-dark', bgColor: 'bg-pine/5', href: '/resources?tags=elders' },
            { name: 'Business', icon: BusinessIcon, color: 'text-midnight-light', bgColor: 'bg-midnight/5', href: '/resources?tags=business' },
            { name: 'Language', icon: LanguageIcon, color: 'text-clay', bgColor: 'bg-clay/5', href: '/resources?tags=language' },
            { name: 'Legal', icon: EducationIcon, color: 'text-pine', bgColor: 'bg-pine/5', href: '/resources?tags=legal' },
            { name: 'Advocacy', icon: EmergencyIcon, color: 'text-clay-dark', bgColor: 'bg-clay/5', href: '/resources?tags=advocacy' },
          ].map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white rounded-earth p-6 text-center hover:shadow-lg transition-all border border-desert/20 hover:border-clay/30 relative overflow-hidden"
              >
                {/* Background accent */}
                <div className={`absolute inset-0 ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                <div className="relative">
                  <div className={`flex justify-center mb-3 ${category.color}`}>
                    <IconComponent className="w-12 h-12 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-medium text-midnight">{category.name}</div>
                </div>
              </Link>
            )
          })}
        </div>
        </section>
      </div>
    </div>
  )
}
