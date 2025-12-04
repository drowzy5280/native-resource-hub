import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'First-Time Applying for Tribal Benefits | Resource Guide',
  description: 'Complete beginner\'s guide to applying for Native American tribal benefits. Learn about eligibility, required documents, application processes, and common mistakes to avoid.',
}

export default function FirstTimeApplyingGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-text-secondary">
        <Link href="/" className="hover:text-pine transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-pine transition-colors">Guides</Link>
        <span className="mx-2">/</span>
        <span className="text-text">First-Time Applying for Tribal Benefits</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="text-5xl mb-6">🎯</div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
          First-Time Applying for Tribal Benefits
        </h1>
        <div className="flex items-center gap-4 text-text-secondary">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            12 min read
          </span>
          <span>•</span>
          <span>Last updated: December 2025</span>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-desert/10 rounded-earth-lg p-6 mb-12 border border-desert/20">
        <h2 className="text-lg font-heading font-bold text-text mb-4">Table of Contents</h2>
        <nav className="space-y-2">
          {[
            'Understanding Your Eligibility',
            'Types of Tribal Benefits Available',
            'Required Documentation',
            'Step-by-Step Application Process',
            'Common Mistakes to Avoid',
            'What to Expect After Applying',
            'Getting Help with Your Application',
            'Frequently Asked Questions',
          ].map((section, index) => (
            <a
              key={index}
              href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
              className="block text-text-secondary hover:text-pine transition-colors pl-4 border-l-2 border-transparent hover:border-pine"
            >
              {index + 1}. {section}
            </a>
          ))}
        </nav>
      </div>

      {/* Content */}
      <article className="prose prose-lg max-w-none">
        {/* Introduction */}
        <div className="bg-pine/5 border-l-4 border-pine p-6 rounded-r-earth mb-12">
          <p className="text-lg text-text leading-relaxed m-0">
            Applying for tribal benefits for the first time can feel overwhelming, but you're not alone.
            This comprehensive guide walks you through everything you need to know—from understanding your
            eligibility to submitting your first application. Whether you're seeking healthcare, education,
            housing assistance, or other benefits, we'll help you navigate the process with confidence.
          </p>
        </div>

        {/* Section 1 */}
        <section id="understanding-your-eligibility" className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">1. Understanding Your Eligibility</h2>

          <p className="text-text-secondary leading-relaxed mb-6">
            Before applying for any tribal benefits, it's essential to understand your eligibility status.
            Most tribal benefits require one of the following:
          </p>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft mb-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">Primary Eligibility Categories</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-pine text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <strong className="text-text">Enrolled Tribal Members:</strong>
                  <p className="text-text-secondary mt-1">
                    You are officially enrolled with a federally recognized tribe and possess a tribal enrollment
                    certificate or card (sometimes called CDIB - Certificate of Degree of Indian Blood).
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-pine text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <strong className="text-text">Direct Descendants:</strong>
                  <p className="text-text-secondary mt-1">
                    You are a direct descendant (child, grandchild) of an enrolled tribal member. Some programs
                    serve descendants even if you're not personally enrolled.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-pine text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <strong className="text-text">Blood Quantum Requirements:</strong>
                  <p className="text-text-secondary mt-1">
                    Some programs require a minimum blood quantum (e.g., 1/4 or 1/2 Native American heritage).
                    This is documented on your CDIB certificate.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-pine text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <strong className="text-text">Residency Status:</strong>
                  <p className="text-text-secondary mt-1">
                    Some state and tribal programs require you to live on or near a reservation or within specific
                    geographic boundaries (service area).
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-warning/10 border-l-4 border-warning p-6 rounded-r-earth mb-6">
            <p className="font-semibold text-text mb-2">⚠️ Important Note:</p>
            <p className="text-text-secondary m-0">
              Eligibility requirements vary significantly between federal, state, and tribal programs. Always check
              the specific requirements for each program you're interested in. Don't assume you're ineligible—many
              programs have more flexible requirements than you might think!
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="types-of-tribal-benefits-available" className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">2. Types of Tribal Benefits Available</h2>

          <p className="text-text-secondary leading-relaxed mb-6">
            There's a wide range of benefits and services available to Native Americans. Here's an overview
            of the main categories:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[
              {
                icon: '🏥',
                title: 'Healthcare',
                items: [
                  'Indian Health Service (IHS) facilities',
                  'Tribal health clinics',
                  'Urban Indian health centers',
                  'Dental and vision care',
                  'Mental health services',
                  'Pharmacy services',
                ],
              },
              {
                icon: '🎓',
                title: 'Education',
                items: [
                  'Scholarships and grants',
                  'Tribal college support',
                  'K-12 educational assistance',
                  'Adult education programs',
                  'Job training programs',
                  'Student loan forgiveness',
                ],
              },
              {
                icon: '🏠',
                title: 'Housing',
                items: [
                  'HUD Native American programs',
                  'Tribal housing assistance',
                  'Home improvement loans',
                  'Rental assistance',
                  'Homeownership programs',
                  'Emergency housing',
                ],
              },
              {
                icon: '💼',
                title: 'Employment & Business',
                items: [
                  'Job placement services',
                  'Business development loans',
                  'Small business grants',
                  'Workforce training',
                  'Entrepreneurship support',
                  'Contract preferences',
                ],
              },
              {
                icon: '🍽️',
                title: 'Food & Nutrition',
                items: [
                  'Food Distribution Program',
                  'SNAP benefits',
                  'WIC services',
                  'Elder nutrition programs',
                  'Community meals',
                  'Food pantries',
                ],
              },
              {
                icon: '⚖️',
                title: 'Legal Services',
                items: [
                  'Native American Rights Fund',
                  'Legal aid organizations',
                  'Child welfare services',
                  'Tribal court assistance',
                  'Land rights advocacy',
                  'Family law support',
                ],
              },
            ].map((category) => (
              <div key={category.title} className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-text mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-text-secondary">
                      <svg className="w-5 h-5 text-pine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section id="required-documentation" className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">3. Required Documentation</h2>

          <p className="text-text-secondary leading-relaxed mb-6">
            Having the right documents ready before you apply will make the process much smoother. Here's a
            comprehensive checklist of documents you may need:
          </p>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft mb-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">Essential Documents Checklist</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">1</span>
                  Tribal Enrollment Proof
                </h4>
                <ul className="pl-10 space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Tribal enrollment certificate or card
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    CDIB (Certificate of Degree of Indian Blood)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Letter from tribal enrollment office
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">2</span>
                  Personal Identification
                </h4>
                <ul className="pl-10 space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Government-issued photo ID (driver's license, passport, or state ID)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Social Security card
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Birth certificate
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">3</span>
                  Proof of Residency
                </h4>
                <ul className="pl-10 space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Utility bill (within last 60 days)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Lease agreement or mortgage statement
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Bank statement with current address
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">4</span>
                  Income Documentation
                </h4>
                <ul className="pl-10 space-y-2 text-text-secondary">
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Recent pay stubs (last 3 months)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Tax returns (last 1-2 years)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Benefit statements (Social Security, unemployment, etc.)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pine mt-1">•</span>
                    Bank statements
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-info/10 border-l-4 border-info p-6 rounded-r-earth">
            <p className="font-semibold text-text mb-2">💡 Pro Tip:</p>
            <p className="text-text-secondary m-0">
              Create a "Benefits Application Folder" (physical or digital) where you keep copies of all these
              documents. This will save you time when applying for multiple programs. Always keep originals safe
              and submit copies unless originals are specifically required.
            </p>
          </div>
        </section>

        {/* Continue with more sections... */}
        <section id="step-by-step-application-process" className="mb-12">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">4. Step-by-Step Application Process</h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Research and Identify Programs',
                description: 'Browse our resource database to find programs that match your needs and eligibility. Save interesting programs to your account for easy access.',
              },
              {
                step: 2,
                title: 'Verify Your Eligibility',
                description: 'Carefully read the eligibility requirements for each program. If unsure, contact the program directly—they\'re there to help!',
              },
              {
                step: 3,
                title: 'Gather Required Documents',
                description: 'Use the checklist above to collect all necessary documentation. Make copies and organize them by program.',
              },
              {
                step: 4,
                title: 'Complete the Application',
                description: 'Fill out applications completely and honestly. If you don\'t understand a question, call the program office for clarification.',
              },
              {
                step: 5,
                title: 'Submit Your Application',
                description: 'Submit online, by mail, or in person as instructed. Keep a copy of everything you submit along with submission confirmation.',
              },
              {
                step: 6,
                title: 'Follow Up',
                description: 'Note the expected response time. If you haven\'t heard back within that timeframe, follow up with a polite phone call or email.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-earth-lg p-6 border-l-4 border-pine shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-pine text-white rounded-earth flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-heading font-semibold text-text mb-2">{item.title}</h3>
                    <p className="text-text-secondary">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20 mt-12">
          <h2 className="text-2xl font-heading font-bold text-text mb-4">Ready to Get Started?</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Now that you understand the basics, it's time to explore available resources and begin your application journey.
            Remember, applying for benefits is your right, and there are people ready to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft"
            >
              Browse Resources
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
            >
              View FAQs
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
