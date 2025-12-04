import { Metadata } from 'next'
import { SectionHeader } from '@/components/SectionHeader'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resource Guides | Tribal Resource Hub',
  description: 'Comprehensive guides to help you navigate tribal benefits, enrollment, eligibility, and state-specific programs.',
  keywords: [
    'tribal benefits guide',
    'tribal enrollment guide',
    'eligibility requirements',
    'state benefits guide',
    'Native American resources guide',
  ],
}

const guides = [
  {
    slug: 'first-time-applying',
    title: 'First-Time Applying for Tribal Benefits',
    description: 'A complete beginner\'s guide to understanding and applying for tribal benefits. Learn about eligibility, required documents, and step-by-step application processes.',
    icon: '🎯',
    category: 'Getting Started',
    readTime: 12,
    color: 'bg-pine/5 border-pine/30 hover:border-pine',
  },
  {
    slug: 'tribal-enrollment',
    title: 'How to Document Tribal Enrollment',
    description: 'Learn how to obtain, verify, and use your tribal enrollment documentation. Covers enrollment certificates, blood quantum, and descendancy documentation.',
    icon: '📋',
    category: 'Documentation',
    readTime: 10,
    color: 'bg-clay/5 border-clay/30 hover:border-clay',
  },
  {
    slug: 'eligibility-requirements',
    title: 'Understanding Eligibility Requirements',
    description: 'Decode eligibility criteria for federal, state, and tribal programs. Learn about income limits, residency requirements, and tribal enrollment specifications.',
    icon: '✓',
    category: 'Eligibility',
    readTime: 15,
    color: 'bg-gold/5 border-gold/30 hover:border-gold',
  },
  {
    slug: 'state-benefits-overview',
    title: 'State-by-State Benefits Overview',
    description: 'Comprehensive guide to state-specific programs and benefits available to Native Americans in all 50 states. Find programs unique to your location.',
    icon: '🗺️',
    category: 'State Resources',
    readTime: 20,
    color: 'bg-stone/5 border-stone/30 hover:border-stone',
  },
]

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <SectionHeader
        title="Resource Guides"
        description="Everything you need to know about accessing tribal benefits and resources"
      />

      {/* SEO Content */}
      <div className="bg-desert/10 rounded-earth-lg p-6 mb-12 border border-desert/20">
        <p className="text-gray-800 leading-relaxed">
          Our comprehensive guides help you navigate the complex world of Native American benefits and resources.
          Whether you're applying for tribal benefits for the first time, documenting your enrollment, understanding
          eligibility requirements, or exploring state-specific programs, these step-by-step guides provide clear,
          actionable information. Written for tribal members, descendants, and first-time applicants, our guides
          cover federal programs (IHS, BIA, HUD), state assistance, tribal services, and scholarship applications.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className={`group bg-white rounded-earth-lg p-8 border-2 transition-all shadow-soft hover:shadow-soft-lg ${guide.color}`}
          >
            {/* Icon & Category */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-5xl">{guide.icon}</div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                  {guide.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {guide.readTime} min read
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-heading font-bold text-text mb-3 group-hover:text-pine transition-colors">
              {guide.title}
            </h3>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed mb-4">
              {guide.description}
            </p>

            {/* Read More */}
            <div className="flex items-center gap-2 text-pine font-medium group-hover:gap-3 transition-all">
              Read Guide
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="bg-gradient-to-br from-pine/5 via-cream to-gold/5 rounded-earth-lg p-8 border border-desert/20">
        <h2 className="text-2xl font-heading font-bold text-text mb-4">Need More Help?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/faq" className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-pine text-white rounded-earth flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1 group-hover:text-pine transition-colors">Frequently Asked Questions</h3>
                <p className="text-sm text-text-secondary">Quick answers to common questions</p>
              </div>
            </div>
          </Link>

          <Link href="/stories" className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-clay text-white rounded-earth flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1 group-hover:text-clay transition-colors">Success Stories</h3>
                <p className="text-sm text-text-secondary">Learn from others' experiences</p>
              </div>
            </div>
          </Link>

          <Link href="/resources" className="group">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gold-dark text-white rounded-earth flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1 group-hover:text-gold-dark transition-colors">Browse Resources</h3>
                <p className="text-sm text-text-secondary">Search our full database</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
