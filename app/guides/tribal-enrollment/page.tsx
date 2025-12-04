import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How to Document Tribal Enrollment | Resource Guide',
  description: 'Complete guide to obtaining and using tribal enrollment documentation, including CDIB certificates, blood quantum verification, and descendancy proof.',
}

export default function TribalEnrollmentGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-text-secondary">
        <Link href="/" className="hover:text-pine transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-pine transition-colors">Guides</Link>
        <span className="mx-2">/</span>
        <span className="text-text">How to Document Tribal Enrollment</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="text-5xl mb-6">📋</div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
          How to Document Tribal Enrollment
        </h1>
        <div className="flex items-center gap-4 text-text-secondary">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            10 min read
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
            Tribal enrollment documentation is essential for accessing most Native American benefits and resources.
            This guide explains what documents you need, how to obtain them, and how to use them when applying
            for scholarships, healthcare, housing assistance, and other programs.
          </p>
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Understanding Tribal Enrollment Documents</h2>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft mb-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">Primary Documents</h3>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">1</span>
                  Tribal Enrollment Certificate
                </h4>
                <ul className="pl-10 space-y-2 text-text-secondary">
                  <li>• Official document issued by your tribe's enrollment office</li>
                  <li>• Confirms you are an enrolled member</li>
                  <li>• Includes your enrollment number and date</li>
                  <li>• Required for most federal and tribal benefits</li>
                  <li>• May also be called: Tribal ID, Tribal Membership Card, or Enrollment Card</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">2</span>
                  Certificate of Degree of Indian Blood (CDIB)
                </h4>
                <ul className="pl-10 space-y-2 text-text-secondary">
                  <li>• Issued by the Bureau of Indian Affairs (BIA)</li>
                  <li>• Shows your blood quantum (e.g., 1/2, 1/4, Full Blood)</li>
                  <li>• Required for many scholarships and programs</li>
                  <li>• Different from tribal enrollment certificate</li>
                  <li>• Can take 8-12 weeks to obtain</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-pine text-white rounded-earth flex items-center justify-center text-sm">3</span>
                  Descendancy Documentation
                </h4>
                <ul className="pl-10 space-y-2 text-text-secondary">
                  <li>• Proves you are descended from an enrolled member</li>
                  <li>• Birth certificates linking you to enrolled parent/grandparent</li>
                  <li>• May be accepted when enrollment certificate isn't required</li>
                  <li>• Useful for some scholarships and nonprofit programs</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">How to Obtain Your Documents</h2>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft mb-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">Getting Your Tribal Enrollment Certificate</h3>

            <div className="space-y-4">
              <p className="text-text-secondary">
                <strong className="text-text">Step 1:</strong> Contact your tribe's enrollment office
              </p>
              <ul className="pl-6 space-y-2 text-text-secondary">
                <li>• Find contact information in our <Link href="/tribes" className="text-pine hover:underline">Tribes directory</Link></li>
                <li>• Call or visit the enrollment office during business hours</li>
                <li>• Ask about their specific enrollment process and requirements</li>
              </ul>

              <p className="text-text-secondary mt-4">
                <strong className="text-text">Step 2:</strong> Gather required documents
              </p>
              <ul className="pl-6 space-y-2 text-text-secondary">
                <li>• Your birth certificate</li>
                <li>• Parents' birth certificates (if applying through parents)</li>
                <li>• Proof of ancestry (family tree, tribal records)</li>
                <li>• Government-issued photo ID</li>
                <li>• Social Security card</li>
              </ul>

              <p className="text-text-secondary mt-4">
                <strong className="text-text">Step 3:</strong> Complete the application
              </p>
              <ul className="pl-6 space-y-2 text-text-secondary">
                <li>• Each tribe has its own enrollment criteria</li>
                <li>• Common requirements: blood quantum, descendancy, residency</li>
                <li>• Processing time varies: 2-6 months typically</li>
                <li>• Some tribes have waiting lists</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
            <h3 className="text-xl font-heading font-semibold text-text mb-4">Obtaining a CDIB Certificate</h3>

            <div className="space-y-4">
              <p className="text-text-secondary">
                The CDIB is issued by the Bureau of Indian Affairs. Here's how to get one:
              </p>

              <div className="bg-info/10 border-l-4 border-info p-4 rounded-r-earth">
                <p className="font-semibold text-text mb-2">📍 Where to Apply:</p>
                <ul className="space-y-1 text-text-secondary text-sm">
                  <li>• Your tribe's enrollment office (they can help with BIA applications)</li>
                  <li>• BIA Regional Office servicing your tribe</li>
                  <li>• Online through BIA's website (availability varies)</li>
                </ul>
              </div>

              <p className="text-text-secondary mt-4">
                <strong className="text-text">Required Documents:</strong>
              </p>
              <ul className="pl-6 space-y-2 text-text-secondary">
                <li>• Completed BIA Form 4432 (Application for CDIB)</li>
                <li>• Birth certificate</li>
                <li>• Tribal enrollment documentation</li>
                <li>• Parents' birth certificates and tribal documents</li>
                <li>• Marriage certificates (if name changed)</li>
              </ul>

              <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-r-earth mt-4">
                <p className="font-semibold text-text mb-2">⏰ Processing Time:</p>
                <p className="text-text-secondary text-sm m-0">
                  CDIB applications typically take 8-12 weeks to process. Apply early if you need it for a
                  scholarship or program deadline! Rush processing is not available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Using Your Documents</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <h3 className="text-lg font-heading font-semibold text-text mb-3">✓ Best Practices</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• Always keep originals in a safe place</li>
                <li>• Make multiple certified copies</li>
                <li>• Submit copies, not originals (unless required)</li>
                <li>• Keep digital scans in secure cloud storage</li>
                <li>• Update documents when name/address changes</li>
                <li>• Check expiration dates regularly</li>
              </ul>
            </div>

            <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <h3 className="text-lg font-heading font-semibold text-text mb-3">⚠️ Common Mistakes</h3>
              <ul className="space-y-2 text-text-secondary text-sm">
                <li>• Waiting until deadline to request documents</li>
                <li>• Sending originals that can't be returned</li>
                <li>• Using expired enrollment cards</li>
                <li>• Not getting documents notarized when required</li>
                <li>• Assuming CDIB and enrollment are the same</li>
                <li>• Not keeping copies of submitted documents</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
          <h2 className="text-2xl font-heading font-bold text-text mb-4">Ready to Apply for Resources?</h2>
          <p className="text-text-secondary mb-6 leading-relaxed">
            Now that you understand enrollment documentation, you're ready to start applying for benefits and resources!
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
              href="/tribes"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
            >
              Find Your Tribe
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
