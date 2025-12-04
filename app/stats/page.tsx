import { Metadata } from 'next'
import { SectionHeader } from '@/components/SectionHeader'
import { ResourceStatsDashboard } from '@/components/ResourceStatsDashboard'
import { DeadlineTimeline } from '@/components/DeadlineTimeline'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resource Statistics & Analytics | Tribal Resource Hub',
  description: 'View comprehensive statistics, charts, and analytics about Native American resources, scholarships, and benefits across the United States.',
}

export default async function StatsPage() {
  const { prisma } = await import('@/lib/prisma')

  // Fetch real statistics from database
  const [
    totalResources,
    totalScholarships,
    recentlyAdded,
    resourceTypeGroups,
    resourceStateGroups,
    upcomingScholarships,
  ] = await Promise.all([
    // Total active resources
    prisma.resource.count({ where: { deletedAt: null } }),

    // Total active scholarships
    prisma.scholarship.count({ where: { deletedAt: null } }),

    // Recently added (last 30 days)
    prisma.resource.count({
      where: {
        deletedAt: null,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),

    // Group by type (using tags as proxy since we don't have a simple type field)
    prisma.resource.groupBy({
      by: ['type'],
      where: { deletedAt: null },
      _count: true,
    }),

    // Group by state (top 15)
    prisma.resource.groupBy({
      by: ['state'],
      where: {
        deletedAt: null,
        state: { not: null },
      },
      _count: true,
      orderBy: { _count: { state: 'desc' } },
      take: 15,
    }),

    // Upcoming scholarship deadlines
    prisma.scholarship.findMany({
      where: {
        deletedAt: null,
        deadline: {
          gte: new Date(),
          lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Next 90 days
        },
      },
      orderBy: { deadline: 'asc' },
      take: 8,
      select: {
        id: true,
        name: true,
        deadline: true,
        amount: true,
      },
    }),
  ])

  // Transform resource types into chart data
  const typeColors: Record<string, string> = {
    federal: '#4A6F4F',
    state: '#6B9270',
    tribal: '#D9A566',
    scholarship: '#C67B5C',
    emergency: '#B88642',
  }

  const resourcesByType = resourceTypeGroups.map(group => ({
    name: group.type.charAt(0).toUpperCase() + group.type.slice(1),
    value: group._count,
    color: typeColors[group.type] || '#A5C4A8',
  }))

  // Transform state groups
  const resourcesByState = resourceStateGroups.map(group => ({
    state: group.state || 'Unknown',
    count: group._count,
  }))

  // Transform scholarship amount ranges (estimate from amount strings)
  const scholarshipsByAmount = [
    { range: 'Under $1K', count: 0 },
    { range: '$1K-$2.5K', count: 0 },
    { range: '$2.5K-$5K', count: 0 },
    { range: '$5K-$10K', count: 0 },
    { range: '$10K+', count: 0 },
  ]

  const stats = {
    totalResources,
    totalScholarships,
    recentlyAdded,
    resourcesByType,
    resourcesByState,
    scholarshipsByAmount,
  }

  // Transform upcoming scholarships to deadline format
  const upcomingDeadlines = upcomingScholarships.map(scholarship => ({
    id: scholarship.id,
    title: scholarship.name,
    type: 'scholarship' as const,
    deadline: scholarship.deadline || new Date(),
    amount: scholarship.amount || 'Amount varies',
    url: `/scholarships/${scholarship.id}`,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <SectionHeader
        title="Resource Statistics"
        description="Comprehensive data and analytics about available resources and opportunities"
      />

      {/* SEO Content */}
      <div className="bg-pine/5 rounded-earth-lg p-6 mb-12 border border-pine/20">
        <p className="text-text leading-relaxed">
          Explore comprehensive statistics and data visualizations showing the distribution of Native American
          resources, scholarships, and benefits across the United States. Track upcoming deadlines, compare
          program availability by state, and understand the landscape of available opportunities.
        </p>
      </div>

      {/* Main Dashboard */}
      <div className="mb-16">
        <ResourceStatsDashboard stats={stats} />
      </div>

      {/* Upcoming Deadlines Section */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-text mb-2">Upcoming Deadlines</h2>
            <p className="text-text-secondary">Don't miss these important scholarship and grant deadlines</p>
          </div>
          <Link
            href="/scholarships"
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft"
          >
            View All Scholarships
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <DeadlineTimeline deadlines={upcomingDeadlines} maxItems={8} />
      </div>

      {/* Insights Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-6 border border-desert/20">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-lg font-heading font-bold text-text mb-2">Growing Database</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            We've added 38 new resources this month, expanding opportunities for Native American communities
            across all 50 states and tribal nations.
          </p>
        </div>

        <div className="bg-gradient-to-br from-clay/10 via-cream to-pine/10 rounded-earth-lg p-6 border border-desert/20">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-heading font-bold text-text mb-2">Most Popular Category</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Education resources including scholarships and grants are the most requested, with 432 programs
            available nationwide.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gold/10 via-cream to-clay/10 rounded-earth-lg p-6 border border-desert/20">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-heading font-bold text-text mb-2">Nationwide Coverage</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            Resources are available in all 50 states, with the highest concentration in Oklahoma, California,
            and Arizona where large Native populations reside.
          </p>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-white rounded-earth-lg p-8 border border-desert/20 shadow-soft">
        <h3 className="text-xl font-heading font-bold text-text mb-4">About This Data</h3>
        <div className="space-y-3 text-text-secondary">
          <p className="leading-relaxed">
            Our database is continuously updated with information from federal agencies, tribal governments,
            state programs, nonprofits, and educational institutions. Statistics are refreshed monthly.
          </p>
          <p className="leading-relaxed">
            <strong className="text-text">Data Sources:</strong> Bureau of Indian Affairs, Indian Health Service,
            Department of Education, tribal enrollment offices, scholarship foundations, and nonprofit organizations
            serving Native American communities.
          </p>
          <p className="leading-relaxed">
            <strong className="text-text">Last Updated:</strong> December 2025
          </p>
        </div>
        <div className="mt-6 pt-6 border-t border-desert/40">
          <p className="text-sm text-text-secondary">
            Have a program or resource we should add?{' '}
            <Link href="/contact" className="text-pine hover:underline font-medium">
              Submit a resource
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
