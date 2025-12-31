import { Metadata } from 'next'
import Link from 'next/link'
import { MountainsSilhouette } from '@/components/Patterns'

export const metadata: Metadata = {
  title: 'About Us | Tribal Resource Hub',
  description: 'Learn about Tribal Resource Hub - our mission to connect Native American and Indigenous communities with essential resources, scholarships, and support programs.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pine/10 via-cream to-gold/5">
        <div className="absolute bottom-0 left-0 right-0 text-pine opacity-10">
          <MountainsSilhouette className="w-full h-32" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-6">
            About Tribal Resource Hub
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Connecting Native American and Indigenous communities with the resources,
            programs, and support they deserve.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-earth-lg p-8 md:p-12 border border-desert/20 shadow-soft">
            <h2 className="text-3xl font-heading font-bold text-text mb-6">Our Mission</h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              Tribal Resource Hub exists to bridge the gap between Native American communities and the
              wealth of resources available to them. We believe that accessing tribal benefits, scholarships,
              healthcare services, and support programs shouldn't require hours of research across dozens
              of government websites.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              Our platform consolidates verified resources from federal agencies, state programs, tribal
              governments, and nonprofit organizations into one searchable, easy-to-navigate hub. Whether
              you're a first-time applicant or helping a family member find assistance, we're here to
              simplify your journey.
            </p>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-text mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: '🔍',
                title: 'Curate Resources',
                description: 'We research, verify, and organize resources from hundreds of sources including the Bureau of Indian Affairs, Indian Health Service, tribal governments, and nonprofit organizations.',
              },
              {
                icon: '🎓',
                title: 'Track Scholarships',
                description: 'We maintain an up-to-date database of scholarships specifically for Native American students, complete with deadlines, amounts, and eligibility requirements.',
              },
              {
                icon: '📚',
                title: 'Provide Guidance',
                description: 'Our comprehensive guides walk you through complex processes like applying for tribal benefits, understanding eligibility, and navigating government programs.',
              },
              {
                icon: '🤝',
                title: 'Connect Communities',
                description: 'We highlight nonprofit organizations and advocacy groups working to support Native American communities across education, health, legal rights, and cultural preservation.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-heading font-semibold text-text mb-3">{item.title}</h3>
                <p className="text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-desert/10 via-cream to-gold/5 rounded-earth-lg p-8 md:p-12 border border-desert/20">
            <h2 className="text-3xl font-heading font-bold text-text mb-8 text-center">Our Values</h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Accuracy',
                  description: 'Every resource we list is verified for accuracy. We regularly review and update our database to ensure information remains current and links remain active.',
                },
                {
                  title: 'Accessibility',
                  description: 'We design our platform to be user-friendly for everyone, regardless of technical expertise. Clear navigation, plain language, and mobile-friendly design are priorities.',
                },
                {
                  title: 'Respect',
                  description: 'We approach our work with deep respect for the sovereignty of tribal nations and the diversity of Indigenous cultures across North America.',
                },
                {
                  title: 'Community-Centered',
                  description: 'Our platform is built to serve Native American communities. We listen to feedback and continuously improve based on the needs of the people we serve.',
                },
              ].map((value) => (
                <div key={value.title} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-pine text-white rounded-earth flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold text-text mb-2">{value.title}</h3>
                    <p className="text-text-secondary leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who We Serve Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Who We Serve</h2>
          <div className="bg-white rounded-earth-lg p-8 border border-desert/20 shadow-soft">
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              Tribal Resource Hub is designed for anyone seeking information about Native American
              resources and benefits:
            </p>
            <ul className="space-y-4">
              {[
                'Enrolled members of federally recognized tribes',
                'Descendants of tribal members seeking information about available programs',
                'Students looking for educational scholarships and opportunities',
                'Families navigating healthcare, housing, or emergency assistance programs',
                'Elders seeking nutrition, healthcare, and support services',
                'Social workers, educators, and advocates helping Native American clients',
                'Anyone researching resources for themselves or loved ones',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-pine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-text-secondary">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Editorial Guidelines Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Editorial Guidelines</h2>
          <div className="bg-white rounded-earth-lg p-8 border border-desert/20 shadow-soft">
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              We are committed to providing accurate, helpful, and unbiased information. Our editorial
              team follows strict guidelines to ensure the quality and reliability of our content.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Research Standards',
                  description: 'All resources are verified through official government sources, tribal websites, and reputable organizations before publication.',
                },
                {
                  title: 'Regular Updates',
                  description: 'We review and update our database monthly to ensure deadlines, contact information, and eligibility requirements remain current.',
                },
                {
                  title: 'Transparency',
                  description: 'We clearly label the source of each resource and indicate when information was last verified.',
                },
                {
                  title: 'Community Feedback',
                  description: 'We encourage users to report outdated information and incorporate community feedback into our updates.',
                },
              ].map((guideline) => (
                <div key={guideline.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-pine/10 text-pine rounded-earth flex items-center justify-center mt-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-text mb-1">{guideline.title}</h4>
                    <p className="text-sm text-text-secondary">{guideline.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-heading font-bold text-text mb-6">Our Team</h2>
          <div className="bg-gradient-to-br from-pine/5 via-cream to-gold/5 rounded-earth-lg p-8 border border-desert/20">
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              Tribal Resource Hub was created by a dedicated team passionate about connecting Indigenous
              communities with vital resources. Our team includes researchers, web developers, and
              community advocates who work together to maintain and improve this platform.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-pine/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-10 h-10 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h4 className="font-heading font-semibold text-text">Research Team</h4>
                <p className="text-sm text-text-secondary mt-1">Verifying resources and updating information</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-10 h-10 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h4 className="font-heading font-semibold text-text">Development Team</h4>
                <p className="text-sm text-text-secondary mt-1">Building and maintaining the platform</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-clay/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-10 h-10 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-heading font-semibold text-text">Community Advocates</h4>
                <p className="text-sm text-text-secondary mt-1">Ensuring we serve community needs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="mb-16">
          <div className="bg-clay/5 border-l-4 border-clay rounded-r-earth p-6">
            <h3 className="text-xl font-heading font-semibold text-text mb-3">Important Disclaimer</h3>
            <p className="text-text-secondary leading-relaxed">
              Tribal Resource Hub is an independent information platform. We are not affiliated with
              any government agency, tribal nation, or organization listed on our site. The information
              we provide is for educational purposes and should not be considered legal, financial, or
              professional advice. Always verify eligibility requirements and current information
              directly with the relevant organization or agency before applying for any program or benefit.
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 text-center border border-desert/20">
            <h2 className="text-2xl font-heading font-bold text-text mb-4">Have Questions or Suggestions?</h2>
            <p className="text-text-secondary mb-6 max-w-xl mx-auto">
              We're always looking to improve our platform and add new resources. If you have feedback,
              suggestions, or questions, we'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft"
            >
              Contact Us
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
