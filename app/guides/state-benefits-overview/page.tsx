import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'State-by-State Benefits Overview | Resource Guide',
  description: 'Comprehensive guide to state-specific Native American benefits, programs, and resources across the United States.',
}

export default function StateBenefitsGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-text-secondary">
        <Link href="/" className="hover:text-pine transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-pine transition-colors">Guides</Link>
        <span className="mx-2">/</span>
        <span className="text-text">State-by-State Benefits Overview</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="text-5xl mb-6">🗺️</div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
          State-by-State Benefits Overview
        </h1>
        <div className="flex items-center gap-4 text-text-secondary">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            15 min read
          </span>
          <span>•</span>
          <span>Last updated: December 2025</span>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-lg max-w-none space-y-12">
        {/* Introduction */}
        <div className="bg-pine/5 border-l-4 border-pine p-6 rounded-r-earth">
          <p className="text-lg text-text leading-relaxed m-0">
            In addition to federal programs, many states offer specific benefits and resources for Native American
            and Indigenous residents. This guide breaks down programs by state, helping you find resources available
            in your area beyond tribal and federal offerings.
          </p>
        </div>

        {/* Understanding State Benefits */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Understanding State Benefits</h2>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft mb-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">Why State Benefits Matter</h3>
            <p className="text-text-secondary leading-relaxed mb-4">
              State programs can supplement federal and tribal benefits, often providing:
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li>• <strong className="text-text">Additional Education Funding:</strong> State scholarships, tuition waivers, grant programs</li>
              <li>• <strong className="text-text">Healthcare Access:</strong> State Medicaid expansions, health programs, insurance assistance</li>
              <li>• <strong className="text-text">Housing Support:</strong> Down payment assistance, rental programs, weatherization</li>
              <li>• <strong className="text-text">Economic Development:</strong> Small business grants, job training, entrepreneurship support</li>
              <li>• <strong className="text-text">Cultural Preservation:</strong> Language programs, arts funding, historical site support</li>
            </ul>
          </div>

          <div className="bg-info/10 border-l-4 border-info p-6 rounded-r-earth">
            <p className="font-semibold text-text mb-2">💡 Important Note:</p>
            <p className="text-text-secondary m-0">
              State programs vary significantly in eligibility requirements. Some require state residency, others
              require tribal enrollment, and some accept descendancy proof. Always check specific eligibility
              criteria for each program.
            </p>
          </div>
        </section>

        {/* States with Largest Native Populations */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">States with Major Indigenous Programs</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            These states have the largest Native American populations and typically offer the most comprehensive
            state-level programs:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                state: 'Oklahoma',
                population: '~400,000+',
                tribes: '39 federally recognized tribes',
                highlights: [
                  'Native American tuition waiver at state colleges',
                  'Indian Child Welfare services',
                  'Economic development grants',
                  'Healthcare access programs',
                ],
                color: 'border-pine',
              },
              {
                state: 'California',
                population: '~720,000+',
                tribes: '109 federally recognized tribes',
                highlights: [
                  'Cal Grant fee waivers',
                  'Native American Graves Protection',
                  'Cultural heritage grants',
                  'Housing assistance programs',
                ],
                color: 'border-clay',
              },
              {
                state: 'Arizona',
                population: '~400,000+',
                tribes: '22 federally recognized tribes',
                highlights: [
                  'Tuition waivers for enrolled members',
                  'Native American Affairs Commission',
                  'Healthcare coordination programs',
                  'Economic development support',
                ],
                color: 'border-gold',
              },
              {
                state: 'New Mexico',
                population: '~200,000+',
                tribes: '23 federally recognized tribes/pueblos',
                highlights: [
                  'Native American tuition waiver',
                  'Indian Affairs Department programs',
                  'Language preservation grants',
                  'Small business assistance',
                ],
                color: 'border-desert',
              },
              {
                state: 'Texas',
                population: '~315,000+',
                tribes: '3 federally recognized tribes',
                highlights: [
                  'Higher education grants',
                  'Tribal liaison programs',
                  'Healthcare access support',
                  'Cultural program funding',
                ],
                color: 'border-stone',
              },
              {
                state: 'North Carolina',
                population: '~150,000+',
                tribes: '1 federally recognized tribe',
                highlights: [
                  'Commission of Indian Affairs programs',
                  'Education grants and scholarships',
                  'Economic development initiatives',
                  'Healthcare programs',
                ],
                color: 'border-pine',
              },
              {
                state: 'Alaska',
                population: '~120,000+',
                tribes: '229 federally recognized tribes',
                highlights: [
                  'Alaska Native education grants',
                  'Subsistence rights programs',
                  'Healthcare through Alaska Native Medical Center',
                  'Cultural heritage funding',
                ],
                color: 'border-clay',
              },
              {
                state: 'Washington',
                population: '~150,000+',
                tribes: '29 federally recognized tribes',
                highlights: [
                  'Native American tuition waiver',
                  'Governor\'s Office of Indian Affairs',
                  'Tribal compact coordination',
                  'Healthcare partnerships',
                ],
                color: 'border-gold',
              },
            ].map((item, index) => (
              <div key={index} className={`bg-white rounded-earth-lg p-6 border-2 ${item.color} shadow-soft`}>
                <h3 className="text-xl font-heading font-bold text-text mb-2">{item.state}</h3>
                <div className="text-sm text-text-muted mb-4">
                  <p className="mb-1"><strong className="text-text">Population:</strong> {item.population}</p>
                  <p><strong className="text-text">Tribes:</strong> {item.tribes}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text mb-2">Key Programs:</p>
                  <ul className="space-y-1">
                    {item.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-text-secondary">• {highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Common State Program Categories */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Common State Program Categories</h2>

          <div className="space-y-6">
            {[
              {
                category: 'Education Benefits',
                icon: '🎓',
                examples: [
                  'In-state tuition waivers for enrolled tribal members',
                  'State-funded scholarships specifically for Native students',
                  'Grants for graduate and professional programs',
                  'K-12 support programs and tutoring services',
                ],
                eligibility: 'Typically requires state residency + tribal enrollment or descendancy',
              },
              {
                category: 'Healthcare Programs',
                icon: '🏥',
                examples: [
                  'Medicaid expansions for Native populations',
                  'State-funded health clinics in partnership with tribes',
                  'Mental health and substance abuse services',
                  'Traditional medicine integration programs',
                ],
                eligibility: 'State residency, often with income requirements',
              },
              {
                category: 'Housing Assistance',
                icon: '🏠',
                examples: [
                  'First-time homebuyer programs',
                  'Down payment assistance grants',
                  'Rental assistance programs',
                  'Home weatherization and repair services',
                ],
                eligibility: 'State residency + income limits typically required',
              },
              {
                category: 'Economic Development',
                icon: '💼',
                examples: [
                  'Small business startup grants',
                  'Microloan programs',
                  'Workforce development and job training',
                  'Entrepreneurship workshops and mentoring',
                ],
                eligibility: 'Varies by program - business plan often required',
              },
              {
                category: 'Cultural & Language Programs',
                icon: '🎨',
                examples: [
                  'Native language preservation grants',
                  'Arts and crafts funding',
                  'Cultural center support',
                  'Historical preservation projects',
                ],
                eligibility: 'Often available to tribal organizations and cultural groups',
              },
              {
                category: 'Social Services',
                icon: '🤝',
                examples: [
                  'Child welfare services (ICWA compliance)',
                  'Elder care programs',
                  'Food assistance programs',
                  'Emergency assistance funds',
                ],
                eligibility: 'State residency, income-based in many cases',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold text-text mb-3">{item.category}</h3>
                    <p className="text-sm font-semibold text-text mb-2">Examples:</p>
                    <ul className="space-y-1 mb-4">
                      {item.examples.map((example, idx) => (
                        <li key={idx} className="text-text-secondary text-sm">• {example}</li>
                      ))}
                    </ul>
                    <div className="bg-desert/10 rounded-earth p-3">
                      <p className="text-xs text-text-muted m-0">
                        <strong className="text-text">Typical Eligibility:</strong> {item.eligibility}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How to Find State Resources */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">How to Find Resources in Your State</h2>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">1</span>
                  Check State Indian Affairs Offices
                </h3>
                <p className="pl-10 text-text-secondary">
                  Most states with significant Native populations have a dedicated office or commission for Indian
                  Affairs. These offices coordinate programs and can direct you to available resources.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">2</span>
                  Contact Your Tribe's Services Department
                </h3>
                <p className="pl-10 text-text-secondary">
                  Your tribe may have partnerships with state programs or know about state benefits you qualify for.
                  They often help members navigate both tribal and state resources.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">3</span>
                  Use Our State Filter
                </h3>
                <p className="pl-10 text-text-secondary mb-3">
                  Search our <Link href="/resources" className="text-pine hover:underline">resources database</Link> using
                  the state filter to find programs available in your area. We track both federal and state-specific programs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">4</span>
                  Check State Higher Education Agencies
                </h3>
                <p className="pl-10 text-text-secondary">
                  State education departments often have dedicated pages for Native American students with information
                  about tuition waivers, scholarships, and support programs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">5</span>
                  Look for Urban Indian Organizations
                </h3>
                <p className="pl-10 text-text-secondary">
                  If you live in a city, Urban Indian Centers often coordinate state programs and can help you access
                  benefits even if you don't live on or near a reservation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference Table */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Quick Reference: Tuition Waiver States</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Many states offer tuition waivers or reduced tuition at public colleges for enrolled tribal members.
            Here's a quick reference:
          </p>

          <div className="bg-white rounded-earth-lg overflow-hidden border border-desert/20 shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-pine/10">
                  <tr>
                    <th className="px-4 py-3 text-text font-semibold">State</th>
                    <th className="px-4 py-3 text-text font-semibold">Program</th>
                    <th className="px-4 py-3 text-text font-semibold">Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-desert/20">
                  {[
                    {
                      state: 'Oklahoma',
                      program: 'Native American Tuition Waiver',
                      eligibility: 'Enrolled tribal member + residency',
                    },
                    {
                      state: 'New Mexico',
                      program: 'Native American Tuition Waiver',
                      eligibility: 'Enrolled member of NM tribe/pueblo',
                    },
                    {
                      state: 'Washington',
                      program: 'State Need Grant - Native Waiver',
                      eligibility: 'Enrolled member + WA residency',
                    },
                    {
                      state: 'Arizona',
                      program: 'Tribal Member Tuition Waiver',
                      eligibility: 'Enrolled in AZ tribe',
                    },
                    {
                      state: 'North Carolina',
                      program: 'Native American Tuition Assistance',
                      eligibility: 'Enrolled + NC residency 1 year+',
                    },
                    {
                      state: 'Montana',
                      program: 'Indian Student Fee Waiver',
                      eligibility: 'Enrolled + 1 year MT residency',
                    },
                    {
                      state: 'North Dakota',
                      program: 'Native American Scholarship',
                      eligibility: 'Enrolled + ND residency',
                    },
                    {
                      state: 'South Dakota',
                      program: 'Native American Tuition Exemption',
                      eligibility: 'Enrolled member of SD tribe',
                    },
                  ].map((row, index) => (
                    <tr key={index} className="hover:bg-desert/5">
                      <td className="px-4 py-3 font-semibold text-text">{row.state}</td>
                      <td className="px-4 py-3 text-text-secondary">{row.program}</td>
                      <td className="px-4 py-3 text-text-secondary text-sm">{row.eligibility}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-r-earth mt-4">
            <p className="text-text-secondary text-sm m-0">
              <strong className="text-text">Note:</strong> Requirements and availability change. Always verify current
              eligibility and application procedures with your state's higher education office or financial aid department.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
          <h2 className="text-2xl font-heading font-bold text-text mb-4">Find Resources in Your State</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Use our advanced search filters to discover state-specific programs, scholarships, and benefits available
            to you. Filter by your state to see all relevant resources in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/resources?type=scholarship,grant"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft"
            >
              Browse All Resources
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/scholarships"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
            >
              View Scholarships
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
