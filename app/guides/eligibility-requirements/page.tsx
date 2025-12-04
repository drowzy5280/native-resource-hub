import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Understanding Eligibility Requirements | Resource Guide',
  description: 'Comprehensive guide to understanding eligibility requirements for Native American resources, benefits, and scholarships.',
}

export default function EligibilityGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-8 text-sm text-text-secondary">
        <Link href="/" className="hover:text-pine transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/guides" className="hover:text-pine transition-colors">Guides</Link>
        <span className="mx-2">/</span>
        <span className="text-text">Understanding Eligibility Requirements</span>
      </nav>

      <div className="mb-12">
        <div className="text-5xl mb-6">✓</div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
          Understanding Eligibility Requirements
        </h1>
        <p className="text-xl text-text-secondary">Decode eligibility criteria for federal, state, and tribal programs</p>
      </div>

      <article className="prose prose-lg max-w-none space-y-8">
        <div className="bg-pine/5 border-l-4 border-pine p-6 rounded-r-earth">
          <p className="text-lg text-text leading-relaxed m-0">
            Eligibility requirements can be confusing. This guide breaks down the most common requirements you'll encounter
            and helps you determine which programs you qualify for.
          </p>
        </div>

        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Common Eligibility Types</h2>

          <div className="grid gap-6">
            {[
              {
                title: 'Tribal Enrollment',
                description: 'You must be an enrolled member of a federally recognized tribe',
                programs: 'Most federal programs, IHS, BIA services, tribal-specific scholarships',
                what: 'Tribal enrollment certificate or card from your tribe',
              },
              {
                title: 'Blood Quantum',
                description: 'Minimum percentage of Native American blood required',
                programs: 'Some scholarships, tribal programs with specific requirements',
                what: 'CDIB certificate showing 1/4, 1/2, or other blood quantum',
              },
              {
                title: 'Descendancy',
                description: 'Proof of being descended from an enrolled member',
                programs: 'Some scholarships, nonprofit programs, cultural programs',
                what: 'Birth certificates linking you to enrolled parent/grandparent',
              },
              {
                title: 'Income-Based',
                description: 'Household income must fall below certain limits',
                programs: 'Housing assistance, food programs, some scholarships',
                what: 'Tax returns, pay stubs, benefit statements',
              },
              {
                title: 'Residency',
                description: 'Must live on/near reservation or in specific area',
                programs: 'Some tribal services, state programs, IHS service areas',
                what: 'Utility bills, lease agreement, address verification',
              },
              {
                title: 'Academic',
                description: 'Minimum GPA, enrollment status, field of study',
                programs: 'Scholarships, educational grants',
                what: 'Transcripts, enrollment verification, major declaration',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
                <h3 className="text-xl font-heading font-semibold text-text mb-2">{item.title}</h3>
                <p className="text-text-secondary mb-3">{item.description}</p>
                <div className="space-y-2 text-sm">
                  <p><strong className="text-text">Common in:</strong> {item.programs}</p>
                  <p><strong className="text-text">You'll need:</strong> {item.what}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Quick Eligibility Checker</h2>

          <div className="bg-white rounded-earth-lg p-8 border-2 border-pine/20 shadow-soft">
            <h3 className="text-xl font-heading font-semibold text-text mb-6">Answer these questions to understand your eligibility:</h3>

            <div className="space-y-6">
              {[
                {
                  q: 'Are you enrolled in a federally recognized tribe?',
                  yes: '✅ Eligible for most federal programs, IHS, BIA services, tribal scholarships',
                  no: '⚠️ Limited to descendancy programs, some nonprofits, state programs',
                },
                {
                  q: 'Do you have a CDIB showing 1/4 or higher blood quantum?',
                  yes: '✅ Eligible for blood quantum-specific scholarships and programs',
                  no: '⚠️ Many programs don\'t require blood quantum, focus on enrollment',
                },
                {
                  q: 'Can you prove descendancy from an enrolled member?',
                  yes: '✅ Eligible for descendancy-based programs even without enrollment',
                  no: '❌ May need to research family history or tribal records',
                },
                {
                  q: 'Do you live within an IHS service area?',
                  yes: '✅ Access to IHS facilities and services',
                  no: '✅ Urban Indian Health Centers available in many cities',
                },
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-pine p-4 bg-pine/5 rounded-r-earth">
                  <p className="font-semibold text-text mb-3">{item.q}</p>
                  <p className="text-sm text-success mb-1">If YES: {item.yes}</p>
                  <p className="text-sm text-warning">If NO: {item.no}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Program-Specific Requirements</h2>

          <div className="space-y-4">
            <details className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <summary className="font-semibold text-text cursor-pointer">Federal Programs (IHS, BIA, HUD)</summary>
              <div className="mt-4 text-text-secondary space-y-2">
                <p>• Require tribal enrollment with federally recognized tribe</p>
                <p>• May require residency within service area</p>
                <p>• Income limits for some programs</p>
                <p>• U.S. citizenship or eligible immigration status</p>
              </div>
            </details>

            <details className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <summary className="font-semibold text-text cursor-pointer">Scholarships</summary>
              <div className="mt-4 text-text-secondary space-y-2">
                <p>• Tribal enrollment OR descendancy (varies by scholarship)</p>
                <p>• Minimum GPA (typically 2.5-3.0)</p>
                <p>• Full-time enrollment requirement</p>
                <p>• Essay, recommendations, FAFSA often required</p>
                <p>• Some require specific major or career goals</p>
              </div>
            </details>

            <details className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
              <summary className="font-semibold text-text cursor-pointer">State Programs</summary>
              <div className="mt-4 text-text-secondary space-y-2">
                <p>• State residency required</p>
                <p>• Vary significantly by state</p>
                <p>• Some accept descendancy without enrollment</p>
                <p>• Check our <Link href="/guides/state-benefits-overview" className="text-pine hover:underline">State-by-State Guide</Link></p>
              </div>
            </details>
          </div>
        </section>

        <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
          <h2 className="text-2xl font-heading font-bold text-text mb-4">Still Not Sure?</h2>
          <p className="text-text-secondary mb-6">
            The best way to know if you're eligible is to ask! Contact the program directly—they're there to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/resources" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors">
              Browse Resources
            </Link>
            <Link href="/faq" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors">
              View FAQs
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
