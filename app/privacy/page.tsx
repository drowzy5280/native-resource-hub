import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Tribal Resource Hub',
  description: 'Privacy Policy for Tribal Resource Hub. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'December 16, 2025'

  return (
    <div className="min-h-screen bg-cream/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
            Privacy Policy
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
                Tribal Resource Hub ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you visit our website tribalresourcehub.com (the "Site"). Please read this privacy
                policy carefully. If you do not agree with the terms of this privacy policy, please do
                not access the Site.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Information We Collect</h2>

              <h3 className="text-xl font-heading font-semibold text-text mt-6 mb-3">Personal Information</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="space-y-2 text-text-secondary mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Create an account on our Site
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Subscribe to our newsletter
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Contact us through our contact form
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Save resources to your account
                </li>
              </ul>
              <p className="text-text-secondary leading-relaxed mb-4">
                This information may include:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Name and email address
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  State of residence (optional, to personalize resource recommendations)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Tribal affiliation (optional, to personalize resource recommendations)
                </li>
              </ul>

              <h3 className="text-xl font-heading font-semibold text-text mt-6 mb-3">Automatically Collected Information</h3>
              <p className="text-text-secondary leading-relaxed mb-4">
                When you visit our Site, we may automatically collect certain information about your device and usage, including:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Browser type and version
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Operating system
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  IP address (anonymized)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Pages visited and time spent on pages
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Referring website or source
                </li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">How We Use Your Information</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Provide and maintain our services
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Personalize your experience with relevant resources
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Send you newsletters and updates (if you've subscribed)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Respond to your inquiries and support requests
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Improve our website and services
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Analyze usage patterns to enhance user experience
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  Protect against fraudulent or unauthorized activity
                </li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Cookies and Tracking Technologies</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track activity on our Site and store certain information.
                Cookies are small data files placed on your device. You can instruct your browser to refuse all cookies
                or to indicate when a cookie is being sent.
              </p>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use the following types of cookies:
              </p>
              <ul className="space-y-4 text-text-secondary">
                <li>
                  <strong className="text-text">Essential Cookies:</strong> Required for the Site to function properly
                  (e.g., authentication, security).
                </li>
                <li>
                  <strong className="text-text">Analytics Cookies:</strong> Help us understand how visitors interact
                  with our Site (e.g., Google Analytics).
                </li>
                <li>
                  <strong className="text-text">Advertising Cookies:</strong> Used to display relevant advertisements
                  (e.g., Google AdSense). These may track your browsing habits across different websites.
                </li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Third-Party Services</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We may use third-party services that collect, monitor, and analyze user data:
              </p>
              <ul className="space-y-4 text-text-secondary">
                <li>
                  <strong className="text-text">Google Analytics:</strong> We use Google Analytics to analyze Site usage.
                  Google Analytics collects information such as how often users visit the Site, what pages they visit,
                  and what other sites they used prior to coming to our Site.{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-pine hover:text-pine-dark underline">
                    Google's Privacy Policy
                  </a>
                </li>
                <li>
                  <strong className="text-text">Google AdSense:</strong> We display advertisements through Google AdSense.
                  Google may use cookies to personalize ads based on your interests.{' '}
                  <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-pine hover:text-pine-dark underline">
                    How Google uses information
                  </a>
                </li>
                <li>
                  <strong className="text-text">Supabase:</strong> We use Supabase for authentication and data storage.{' '}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-pine hover:text-pine-dark underline">
                    Supabase Privacy Policy
                  </a>
                </li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Information Sharing and Disclosure</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Service Providers:</strong> With third-party vendors who assist us in operating our Site
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Legal Requirements:</strong> When required by law or to protect our rights
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">With Your Consent:</strong> When you explicitly agree to share information
                </li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Data Security</h2>
              <p className="text-text-secondary leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over
                the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Your Rights and Choices</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="space-y-2 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Access:</strong> Request a copy of your personal data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Correction:</strong> Request correction of inaccurate data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Deletion:</strong> Request deletion of your personal data
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Opt-out:</strong> Unsubscribe from marketing communications
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pine mt-1">•</span>
                  <strong className="text-text">Cookie Preferences:</strong> Manage cookie settings through your browser
                </li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@tribalresourcehub.com" className="text-pine hover:text-pine-dark underline">
                  privacy@tribalresourcehub.com
                </a>
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Children's Privacy</h2>
              <p className="text-text-secondary leading-relaxed">
                Our Site is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If we learn we have collected personal information from a child
                under 13 without parental consent, we will delete that information promptly.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Changes to This Privacy Policy</h2>
              <p className="text-text-secondary leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review
                this Privacy Policy periodically for any changes.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-heading font-bold text-text mb-4">Contact Us</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-desert/10 rounded-earth p-6 border border-desert/20">
                <p className="text-text-secondary">
                  <strong className="text-text">Email:</strong>{' '}
                  <a href="mailto:privacy@tribalresourcehub.com" className="text-pine hover:text-pine-dark underline">
                    privacy@tribalresourcehub.com
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
            href="/terms"
            className="px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-medium hover:bg-pine/5 transition-colors"
          >
            Terms of Service
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
