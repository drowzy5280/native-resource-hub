import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Tribal Resource Hub',
  description: 'Terms of Service for Tribal Resource Hub. Read our terms and conditions for using our Native American resource platform.',
}

export default function TermsOfServicePage() {
  const lastUpdated = 'December 16, 2025'

  return (
    <div className="min-h-screen bg-cream/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
            Terms of Service
          </h1>
          <p className="text-text-secondary">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-earth-lg p-8 md:p-12 border border-desert/20 shadow-soft">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-10">
              <p className="text-lg text-text-secondary leading-relaxed">
                Welcome to Tribal Resource Hub. These Terms of Service ("Terms") govern your use of our website
                located at tribalresourcehub.com (the "Site") and any related services provided by Tribal Resource Hub
                ("we," "us," or "our"). By accessing or using our Site, you agree to be bound by these Terms.
                If you disagree with any part of these Terms, you may not access the Site.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">1. Acceptance of Terms</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                By accessing and using this Site, you accept and agree to be bound by these Terms and our Privacy Policy.
                If you are using the Site on behalf of an organization, you represent that you have the authority to
                bind that organization to these Terms.
              </p>
              <p className="text-text-secondary leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by
                updating the "Last updated" date. Your continued use of the Site after changes constitutes acceptance of
                the modified Terms.
              </p>
            </section>

            {/* Description of Service */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">2. Description of Service</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Tribal Resource Hub is an information platform that aggregates and organizes resources, programs,
                scholarships, and services available to Native American and Indigenous communities. Our services include:
              </p>
              <ul className="space-y-2 text-text-secondary mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  A searchable database of resources from federal, state, tribal, and nonprofit sources
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Scholarship listings with deadlines and eligibility information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Educational guides about applying for tribal benefits
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Directory of nonprofit organizations serving Native communities
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  User account features for saving and tracking resources
                </li>
              </ul>
            </section>

            {/* Important Disclaimers */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">3. Important Disclaimers</h2>

              <div className="bg-clay/5 border-l-4 border-clay rounded-r-earth p-6 mb-6">
                <h3 className="text-lg font-heading font-semibold text-text mb-3">We Are Not a Government Agency</h3>
                <p className="text-text-secondary leading-relaxed m-0">
                  Tribal Resource Hub is an independent, privately operated website. We are not affiliated with,
                  endorsed by, or connected to any federal agency (including the Bureau of Indian Affairs, Indian Health
                  Service, or Department of the Interior), state government, or tribal nation. We do not process
                  applications, determine eligibility, or administer any programs or benefits.
                </p>
              </div>

              <div className="bg-gold/5 border-l-4 border-gold rounded-r-earth p-6 mb-6">
                <h3 className="text-lg font-heading font-semibold text-text mb-3">Information Only</h3>
                <p className="text-text-secondary leading-relaxed m-0">
                  The information provided on this Site is for general informational purposes only and should not be
                  considered legal, financial, medical, or professional advice. Always verify information directly with
                  the relevant organization or agency before making decisions or submitting applications.
                </p>
              </div>

              <div className="bg-pine/5 border-l-4 border-pine rounded-r-earth p-6">
                <h3 className="text-lg font-heading font-semibold text-text mb-3">No Guarantee of Accuracy</h3>
                <p className="text-text-secondary leading-relaxed m-0">
                  While we strive to maintain accurate and up-to-date information, we make no representations or
                  warranties about the completeness, accuracy, reliability, or availability of any information on
                  the Site. Programs, eligibility requirements, deadlines, and contact information may change without
                  notice. You are responsible for verifying all information before relying on it.
                </p>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">4. User Accounts</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Some features of our Site require you to create an account. When you create an account, you agree to:
              </p>
              <ul className="space-y-2 text-text-secondary mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Provide accurate and complete information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Maintain the security of your account credentials
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Accept responsibility for all activities under your account
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Notify us immediately of any unauthorized use
                </li>
              </ul>
              <p className="text-text-secondary leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason
                at our discretion.
              </p>
            </section>

            {/* Acceptable Use */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">5. Acceptable Use</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                You agree not to use the Site to:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Violate any applicable laws or regulations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Infringe on the intellectual property rights of others
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Transmit malware, viruses, or other harmful code
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Attempt to gain unauthorized access to our systems
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Scrape, crawl, or harvest data without permission
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Interfere with the proper functioning of the Site
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Impersonate others or misrepresent your affiliation
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Post false, misleading, or fraudulent content
                </li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">6. Intellectual Property</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                The Site and its original content, features, and functionality are owned by Tribal Resource Hub and
                are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                You may:
              </p>
              <ul className="space-y-2 text-text-secondary mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Access and use the Site for personal, non-commercial purposes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Share links to our content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Print pages for personal reference
                </li>
              </ul>
              <p className="text-text-secondary leading-relaxed">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit
                our content for commercial purposes without our prior written consent.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">7. Third-Party Links and Content</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Our Site contains links to third-party websites, including government agencies, tribal organizations,
                and nonprofits. These links are provided for your convenience and information. We do not:
              </p>
              <ul className="space-y-2 text-text-secondary mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Endorse or assume responsibility for third-party content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Guarantee the accuracy of external information
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Control the privacy practices of third-party sites
                </li>
              </ul>
              <p className="text-text-secondary leading-relaxed">
                Your interactions with third-party sites are solely between you and that third party. We encourage
                you to review the terms and privacy policies of any external sites you visit.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">8. Limitation of Liability</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRIBAL RESOURCE HUB AND ITS OPERATORS, EMPLOYEES, AND
                AFFILIATES SHALL NOT BE LIABLE FOR ANY:
              </p>
              <ul className="space-y-2 text-text-secondary mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Indirect, incidental, special, consequential, or punitive damages
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Loss of profits, data, use, or goodwill
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Damages resulting from reliance on information provided on the Site
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Damages related to your inability to access or use the Site
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-clay mt-1">•</span>
                  Damages caused by third-party actions or content
                </li>
              </ul>
              <p className="text-text-secondary leading-relaxed">
                This limitation applies regardless of the legal theory (contract, tort, negligence, or otherwise)
                and even if we have been advised of the possibility of such damages.
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">9. Indemnification</h2>
              <p className="text-text-secondary leading-relaxed">
                You agree to indemnify, defend, and hold harmless Tribal Resource Hub and its operators, employees,
                and affiliates from any claims, damages, losses, liabilities, and expenses (including attorneys' fees)
                arising out of or related to your use of the Site, violation of these Terms, or infringement of any
                rights of another party.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">10. Governing Law</h2>
              <p className="text-text-secondary leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the United States,
                without regard to its conflict of law provisions. Any disputes arising under these Terms shall be
                resolved in the appropriate courts of the United States.
              </p>
            </section>

            {/* Severability */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">11. Severability</h2>
              <p className="text-text-secondary leading-relaxed">
                If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
                limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain
                in full force and effect.
              </p>
            </section>

            {/* Entire Agreement */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">12. Entire Agreement</h2>
              <p className="text-text-secondary leading-relaxed">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and
                Tribal Resource Hub regarding your use of the Site and supersede any prior agreements or
                understandings.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-text mb-4">13. Contact Us</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-desert/10 rounded-earth p-6 border border-desert/20">
                <p className="text-text-secondary">
                  <strong className="text-text">Email:</strong>{' '}
                  <a href="mailto:legal@tribalresourcehub.com" className="text-pine hover:text-pine-dark underline">
                    legal@tribalresourcehub.com
                  </a>
                </p>
                <p className="text-text-secondary mt-2">
                  <strong className="text-text">Contact Form:</strong>{' '}
                  <Link href="/contact" className="text-pine hover:text-pine-dark underline">
                    tribalresourcehub.com/contact
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link
            href="/privacy"
            className="px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-medium hover:bg-pine/5 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-medium hover:bg-pine/5 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
