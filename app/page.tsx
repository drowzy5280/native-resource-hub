import Link from 'next/link'
import { SearchBar } from '@/components/SearchBar'
import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { ScholarshipCard } from '@/components/ScholarshipCard'
import { AdUnit } from '@/components/GoogleAdsense'
import {
  getCachedFeaturedResources,
  getCachedFeaturedNonprofits,
  getCachedUpcomingScholarships,
  getCachedClosingSoonScholarships,
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

// Force dynamic rendering to avoid build-time database timeouts
export const dynamic = 'force-dynamic'
export const revalidate = 600

export const metadata: Metadata = {
  title: 'Home',
}

export default async function Home() {
  // Optimize: Use cached data and run all queries in parallel
  const [recentResources, featuredNonprofits, upcomingScholarships, closingSoonScholarships, resourceCounts, scholarshipCounts, tribeCount] =
    await Promise.all([
      getCachedFeaturedResources(6),
      getCachedFeaturedNonprofits(6),
      getCachedUpcomingScholarships(4),
      getCachedClosingSoonScholarships(6),
      getCachedResourceCounts(),
      getCachedScholarshipCounts(),
      getCachedTribeCount(),
    ])

  return (
    <div>
      {/* Hero Section - Minimal and Clean */}
      <div className="relative overflow-hidden bg-gradient-to-br from-desert/10 to-cream pattern-circles">
        {/* Subtle background mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0 text-pine opacity-10">
          <MountainsSilhouette className="w-full h-48 sm:h-64" />
        </div>

        {/* Minimal geometric pattern overlay */}
        <div className="absolute inset-0 text-pine opacity-[0.03]">
          <GeometricPattern className="w-full h-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20 lg:py-28">
          <div className="text-center">
            {/* Minimal sun icon */}
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-pine to-gold rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-text mb-4 sm:mb-6 leading-tight px-2">
              Tribal Resource Hub
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-4">
              A community-driven hub connecting Indigenous families, youth, and elders to trusted resources, programs, and support.
            </p>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <SearchBar />
              </div>
            </div>

            {/* Quick Links - Minimal outlined style */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12 px-4 max-w-3xl mx-auto">
              <Link
                href="/resources?tags=emergency"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-clay/10 text-clay-dark border-2 border-clay/40 rounded-earth-lg font-medium hover:bg-clay/15 hover:border-clay/60 hover:shadow-soft transition-all text-sm sm:text-base min-h-[44px] flex items-center justify-center text-center"
              >
                Emergency Resources
              </Link>
              <Link
                href="/nonprofits"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-gold/10 text-gold-dark border-2 border-gold/40 rounded-earth-lg font-medium hover:bg-gold/15 hover:border-gold/60 hover:shadow-soft transition-all text-sm sm:text-base min-h-[44px] flex items-center justify-center text-center"
              >
                Nonprofits
              </Link>
              <Link
                href="/scholarships"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-pine/10 text-pine-dark border-2 border-pine/40 rounded-earth-lg font-medium hover:bg-pine/15 hover:border-pine/60 hover:shadow-soft transition-all text-sm sm:text-base min-h-[44px] flex items-center justify-center text-center"
              >
                Scholarships
              </Link>
              <Link
                href="/tribes"
                className="px-5 sm:px-6 py-3 sm:py-3.5 bg-stone/10 text-stone border-2 border-stone/40 rounded-earth-lg font-medium hover:bg-stone/15 hover:border-stone/60 hover:shadow-soft transition-all text-sm sm:text-base min-h-[44px] flex items-center justify-center text-center"
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
        {/* About Section - SEO Rich Content */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-desert/10 via-cream to-gold/5 rounded-earth-lg p-8 md:p-12 border border-desert/20">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 text-center">
              Your Guide to Native American Resources & Benefits
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-gray-800 leading-relaxed">
              <p className="text-lg md:text-xl text-center mb-8">
                Whether you're seeking educational opportunities, healthcare services, housing assistance, or cultural preservation programs,
                the Tribal Resource Hub connects you to verified resources across federal, state, and tribal organizations.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="bg-white/70 rounded-earth p-6 border border-desert/20">
                  <h3 className="text-xl font-heading font-semibold text-pine mb-3">📍 Finding Your Resources</h3>
                  <p className="text-base">
                    <strong>New to tribal benefits?</strong> Start by exploring our categories like Education, Health, or Housing.
                    Use our search to find specific programs, or browse by your state to discover local opportunities.
                    Every resource includes clear eligibility requirements and direct links to official websites.
                  </p>
                </div>

                <div className="bg-white/70 rounded-earth p-6 border border-desert/20">
                  <h3 className="text-xl font-heading font-semibold text-clay mb-3">🎓 Scholarships & Education</h3>
                  <p className="text-base">
                    Access hundreds of scholarships specifically for Native American students pursuing higher education.
                    From undergraduate programs at tribal colleges to graduate fellowships in STEM fields,
                    we track deadlines and amounts to help you fund your educational journey.
                  </p>
                </div>

                <div className="bg-white/70 rounded-earth p-6 border border-desert/20">
                  <h3 className="text-xl font-heading font-semibold text-gold-dark mb-3">🏛️ Federal & State Programs</h3>
                  <p className="text-base">
                    Navigate complex government programs with ease. We organize federal resources like Indian Health Service,
                    BIA assistance, and HUD housing programs alongside state-specific benefits. Find programs by type
                    (federal, state, tribal) or filter by your location.
                  </p>
                </div>

                <div className="bg-white/70 rounded-earth p-6 border border-desert/20">
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">🤝 Nonprofit Organizations</h3>
                  <p className="text-base">
                    Connect with 65+ nonprofit organizations dedicated to serving Native American communities.
                    From legal advocacy groups like NARF to educational organizations like AISES,
                    find specialized support for legal issues, cultural preservation, health services, and more.
                  </p>
                </div>
              </div>

              <div className="bg-pine/5 rounded-earth p-6 border-l-4 border-pine mt-8">
                <h3 className="text-xl font-heading font-semibold text-pine mb-3">💡 Who Can Use This Hub?</h3>
                <ul className="space-y-2 text-base">
                  <li><strong>Enrolled Tribal Members:</strong> Access federal, state, and tribal-specific resources using your tribal enrollment</li>
                  <li><strong>Descendants & Family Members:</strong> Many programs serve descendants of enrolled members and immediate family</li>
                  <li><strong>Students & Youth:</strong> Find scholarships, educational programs, and youth development opportunities</li>
                  <li><strong>Elders:</strong> Discover nutrition services, healthcare, and senior support programs</li>
                  <li><strong>Urban Indians:</strong> Connect with urban Indian health centers and community organizations</li>
                  <li><strong>First-Time Seekers:</strong> Never applied for tribal benefits before? Start here with clear guidance on eligibility and applications</li>
                </ul>
              </div>

              <div className="bg-clay/5 rounded-earth p-6 border-l-4 border-clay mt-6">
                <h3 className="text-xl font-heading font-semibold text-clay mb-3">🔍 How to Get Started</h3>
                <ol className="space-y-3 text-base list-decimal list-inside">
                  <li><strong>Search or Browse:</strong> Use our search bar for specific needs, or browse categories like Health, Housing, or Emergency Resources</li>
                  <li><strong>Filter by Location:</strong> Select your state to find local programs and state-specific benefits</li>
                  <li><strong>Check Eligibility:</strong> Each resource lists clear eligibility requirements - look for tribal enrollment, income limits, or residency requirements</li>
                  <li><strong>Visit Official Sites:</strong> Click "Visit Website" to access official application forms and detailed program information</li>
                  <li><strong>Find Your Tribe:</strong> Don't know your tribal enrollment office? Use our Tribes directory to find contact information</li>
                </ol>
              </div>

              <div className="text-center mt-8 p-6 bg-gold/10 rounded-earth border border-gold/30">
                <p className="text-lg font-medium text-gray-900 mb-4">
                  <strong>175+ Resources</strong> | <strong>65+ Nonprofits</strong> | <strong>Multiple Scholarships</strong> | <strong>All 50 States</strong>
                </p>
                <p className="text-base text-gray-700">
                  From emergency assistance and healthcare to education and cultural preservation,
                  the Tribal Resource Hub is your starting point for accessing the benefits and support available to Native American and Indigenous communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="mb-16">
        <SectionHeader
          title="Browse by Category"
          description="Find resources specific to your needs"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { name: 'Education', icon: EducationIcon, color: 'text-pine', bgColor: 'bg-pine/5', href: '/resources?tags=education' },
            { name: 'Health', icon: HealthIcon, color: 'text-clay', bgColor: 'bg-clay/5', href: '/resources?tags=health' },
            { name: 'Housing', icon: HousingIcon, color: 'text-stone-dark', bgColor: 'bg-stone/5', href: '/resources?tags=housing' },
            { name: 'Emergency', icon: EmergencyIcon, color: 'text-clay-dark', bgColor: 'bg-clay/5', href: '/resources?tags=emergency' },
            { name: 'Youth', icon: YouthIcon, color: 'text-gold-dark', bgColor: 'bg-gold/5', href: '/resources?tags=youth' },
            { name: 'Elders', icon: EldersIcon, color: 'text-pine-dark', bgColor: 'bg-pine/5', href: '/resources?tags=elders' },
            { name: 'Business', icon: BusinessIcon, color: 'text-stone', bgColor: 'bg-stone/5', href: '/resources?tags=business' },
            { name: 'Language', icon: LanguageIcon, color: 'text-clay', bgColor: 'bg-clay/5', href: '/resources?tags=language' },
            { name: 'Legal', icon: EducationIcon, color: 'text-pine', bgColor: 'bg-pine/5', href: '/resources?tags=legal' },
            { name: 'Advocacy', icon: EmergencyIcon, color: 'text-clay-dark', bgColor: 'bg-clay/5', href: '/resources?tags=advocacy' },
          ].map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.name}
                href={category.href}
                className="group bg-white rounded-earth p-5 sm:p-6 text-center hover:shadow-lg transition-all border border-desert/20 hover:border-clay/30 relative overflow-hidden min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center"
              >
                {/* Background accent */}
                <div className={`absolute inset-0 ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                <div className="relative">
                  <div className={`flex justify-center mb-2 sm:mb-3 ${category.color}`}>
                    <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="font-medium text-sm sm:text-base text-gray-900">{category.name}</div>
                </div>
              </Link>
            )
          })}
        </div>
        </section>

        {/* Quick Stats - Minimal styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/30 relative overflow-hidden group">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 text-pine/5">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L64 0L64 64L32 32L0 0Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text-5xl font-heading font-bold text-pine mb-3">
              {resourceCounts.total}
            </div>
            <div className="text-gray-700 font-medium">Resources Available</div>
          </div>
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/30 relative overflow-hidden group">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 text-clay/5">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L64 0L64 64L32 32L0 0Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text-5xl font-heading font-bold text-clay mb-3">
              {scholarshipCounts.total}
            </div>
            <div className="text-gray-700 font-medium">Scholarships</div>
          </div>
          <div className="bg-white rounded-earth-lg p-8 text-center card-shadow border border-desert/30 relative overflow-hidden group">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 text-gold/5">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L64 0L64 64L32 32L0 0Z" fill="currentColor" />
              </svg>
            </div>
            <div className="text-5xl font-heading font-bold text-gold-dark mb-3">
              {tribeCount}
            </div>
            <div className="text-gray-700 font-medium">Tribes Listed</div>
          </div>
        </div>

        {/* Quick State Filters */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-3">
              Find Resources by State
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quick access to resources in states with large Indigenous communities
            </p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { state: 'OK', name: 'Oklahoma', color: 'bg-clay/10 hover:bg-clay/20 border-clay/30' },
              { state: 'CA', name: 'California', color: 'bg-pine/10 hover:bg-pine/20 border-pine/30' },
              { state: 'AZ', name: 'Arizona', color: 'bg-gold/10 hover:bg-gold/20 border-gold/30' },
              { state: 'NM', name: 'New Mexico', color: 'bg-clay/10 hover:bg-clay/20 border-clay/30' },
              { state: 'TX', name: 'Texas', color: 'bg-pine/10 hover:bg-pine/20 border-pine/30' },
              { state: 'NC', name: 'North Carolina', color: 'bg-gold/10 hover:bg-gold/20 border-gold/30' },
              { state: 'AK', name: 'Alaska', color: 'bg-clay/10 hover:bg-clay/20 border-clay/30' },
              { state: 'WA', name: 'Washington', color: 'bg-pine/10 hover:bg-pine/20 border-pine/30' },
            ].map((item) => (
              <Link
                key={item.state}
                href={`/resources?state=${item.state}`}
                className={`group ${item.color} border-2 rounded-earth-lg p-5 sm:p-6 text-center hover:shadow-soft transition-all min-h-[80px] flex flex-col items-center justify-center`}
              >
                <div className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-1 sm:mb-2">
                  {item.state}
                </div>
                <div className="text-sm text-gray-700 font-medium">{item.name}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-clay hover:text-clay-dark font-medium transition-colors"
            >
              View all states
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Closing Soon Scholarships Widget */}
        {closingSoonScholarships.length > 0 && (
          <section className="mb-16">
            <div className="bg-gradient-to-br from-clay/10 via-gold/5 to-clay/5 rounded-earth-lg p-8 border-2 border-clay/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-clay rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-gray-900">
                    ⏰ Closing Soon!
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Apply now - these scholarships close within the next 30 days
                  </p>
                </div>
                <Link
                  href="/scholarships"
                  className="hidden sm:inline-flex items-center gap-2 text-clay hover:text-clay-dark font-medium transition-colors"
                >
                  View all
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {closingSoonScholarships.map((scholarship) => {
                  const daysUntilDeadline = scholarship.deadline
                    ? Math.ceil((new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : null

                  return (
                    <Link
                      key={scholarship.id}
                      href={`/scholarships/${scholarship.id}`}
                      className="group bg-white rounded-earth-lg p-5 border-2 border-desert/20 hover:border-clay/40 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-heading font-bold text-gray-900 group-hover:text-clay transition-colors line-clamp-2 flex-1">
                          {scholarship.name}
                        </h3>
                        {daysUntilDeadline !== null && (
                          <span className={`flex-shrink-0 px-2 py-1 text-xs font-bold rounded-earth ${
                            daysUntilDeadline <= 7
                              ? 'bg-clay text-white'
                              : daysUntilDeadline <= 14
                              ? 'bg-gold text-gray-900'
                              : 'bg-pine/20 text-pine-dark'
                          }`}>
                            {daysUntilDeadline}d
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {scholarship.description}
                      </p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-gold-dark">
                          {scholarship.amount}
                        </span>
                        {scholarship.deadline && (
                          <span className="text-gray-500">
                            {new Date(scholarship.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>

              <div className="text-center mt-6 sm:hidden">
                <Link
                  href="/scholarships"
                  className="inline-flex items-center gap-2 text-clay hover:text-clay-dark font-medium transition-colors"
                >
                  View all scholarships
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>
        )}

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

        {/* Featured Nonprofits */}
        <section className="mb-16">
        <SectionHeader
          title="Featured Nonprofit Organizations"
          description="Organizations serving Native American and Indigenous communities"
          actionLabel="View All Nonprofits"
          actionHref="/nonprofits"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredNonprofits.map((nonprofit) => (
            <ResourceCard
              key={nonprofit.id}
              id={nonprofit.id}
              title={nonprofit.title}
              description={nonprofit.description}
              type={nonprofit.type}
              tags={nonprofit.tags}
              tribe={nonprofit.tribe || undefined}
              state={nonprofit.state}
              url={nonprofit.url}
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
      </div>
    </div>
  )
}
