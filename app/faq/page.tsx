'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { SectionHeader } from '@/components/SectionHeader'
import Link from 'next/link'

const faqs = [
  {
    category: 'eligibility',
    question: 'Do I need to be enrolled in a tribe to access benefits?',
    answer: 'Not always! While many federal programs require tribal enrollment, some state and nonprofit programs serve descendants or individuals who can demonstrate Native American heritage. Requirements vary by program, so always check the specific eligibility criteria.',
  },
  {
    category: 'eligibility',
    question: 'What is a CDIB and do I need one?',
    answer: 'A CDIB (Certificate of Degree of Indian Blood) is a document issued by the Bureau of Indian Affairs that certifies your blood quantum—the degree of Native American ancestry you have. While not all programs require a CDIB, many federal benefits do. Contact your tribal enrollment office or the BIA to obtain one.',
  },
  {
    category: 'eligibility',
    question: 'Can I access benefits if I live off the reservation?',
    answer: 'Yes! Many benefits are available regardless of where you live. Urban Indian Health Centers serve Native Americans in cities, scholarships are location-independent, and federal programs like HUD assistance are available nationwide. Some tribal programs may require residency within the tribal service area, but many don\'t.',
  },
  {
    category: 'eligibility',
    question: 'What if my tribe is not federally recognized?',
    answer: 'Members of state-recognized but not federally-recognized tribes have limited access to federal programs. However, you may still be eligible for state-specific programs, certain scholarships, and nonprofit organization services. Check our state resources section and contact organizations directly.',
  },
  {
    category: 'application',
    question: 'How long does it take to process an application?',
    answer: 'Processing times vary widely. Scholarship applications may take 2-6 months, housing assistance can take 6-12 months, and healthcare enrollment is often same-day to 2 weeks. Each program listing includes estimated processing times when available. Always apply well before you need the benefit.',
  },
  {
    category: 'application',
    question: 'What should I do if my application is denied?',
    answer: 'First, carefully read the denial letter to understand why. Common reasons include incomplete documentation, missing deadlines, or not meeting eligibility criteria. Most programs allow appeals or reapplication. Contact the program office to discuss your options and what you can do differently.',
  },
  {
    category: 'application',
    question: 'Can I apply for multiple programs at once?',
    answer: 'Absolutely! In fact, we encourage applying to multiple programs simultaneously. There\'s no limit to how many benefits you can receive, as long as you meet each program\'s eligibility requirements. Keep an organized folder with copies of all your applications.',
  },
  {
    category: 'application',
    question: 'Do I need to reapply every year?',
    answer: 'It depends on the program. Scholarships typically require annual applications. Some assistance programs require annual renewal, while others (like IHS registration) remain active unless you move or change tribes. Check your approval letter or program documentation for renewal requirements.',
  },
  {
    category: 'deadlines',
    question: 'What happens if I miss a scholarship deadline?',
    answer: 'Unfortunately, scholarship deadlines are usually firm. However, many scholarships have multiple application cycles throughout the year. If you miss one, note it for next year and look for similar scholarships with later deadlines. Sign up for deadline reminders on our platform.',
  },
  {
    category: 'deadlines',
    question: 'Are benefit applications accepted year-round?',
    answer: 'Most assistance programs (healthcare, housing, food) accept applications year-round. Scholarships typically have specific deadlines between January-March for fall semester. Some tribal programs have annual enrollment periods. Check each program\'s listing for specific application windows.',
  },
  {
    category: 'general',
    question: 'Is there a fee to apply for tribal benefits?',
    answer: 'No! Legitimate tribal benefits, federal programs, and scholarships never charge application fees. If a program asks for payment to apply, it\'s likely a scam. Report suspicious programs to us immediately.',
  },
  {
    category: 'general',
    question: 'How do I know if a program is legitimate?',
    answer: 'All programs listed on our site are verified. Look for: official .gov or tribal websites, established organizations with physical addresses, no upfront fees, and clear contact information. When in doubt, contact your tribal enrollment office or search for the program on official government websites.',
  },
  {
    category: 'general',
    question: 'Can I get help with my application?',
    answer: 'Yes! Many tribal enrollment offices offer application assistance. Indian Health Service facilities have enrollment specialists. Nonprofit organizations like AISES and NCIA provide support. Some programs have dedicated application coaches. Check the "Getting Help" section in our guides.',
  },
  {
    category: 'general',
    question: 'What if I don\'t have all the required documents?',
    answer: 'Contact the program office before the deadline. They may accept partial applications, give you extra time, or suggest alternative documentation. Birth certificates and tribal enrollment documents can be obtained from vital records offices and tribal enrollment departments.',
  },
]

const categories = [
  { id: 'all', label: 'All Questions', icon: '📚' },
  { id: 'eligibility', label: 'Eligibility', icon: '✓' },
  { id: 'application', label: 'Application Process', icon: '📝' },
  { id: 'deadlines', label: 'Deadlines & Timing', icon: '⏰' },
  { id: 'general', label: 'General', icon: '💡' },
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <SectionHeader
        title="Frequently Asked Questions"
        description="Quick answers to common questions about tribal benefits and resources"
      />

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="search"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pr-12 text-lg text-text placeholder:text-text-muted bg-white rounded-earth-lg border-2 border-desert/60 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20 transition-all"
          />
          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-earth border-2 transition-all font-medium flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-pine text-white border-pine'
                  : 'bg-white text-text border-desert/60 hover:border-pine/50'
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4 mb-16">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 bg-desert/10 rounded-earth-lg border border-desert/20">
            <svg className="w-16 h-16 text-text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-text-secondary">No questions found matching your search.</p>
          </div>
        ) : (
          filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-earth-lg border-2 border-desert/20 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-desert/10 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-heading font-semibold text-text mb-1">
                    {faq.question}
                  </h3>
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
                    {categories.find(c => c.id === faq.category)?.label}
                  </span>
                </div>
                <svg
                  className={`w-6 h-6 text-pine flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 pt-2 border-t border-desert/20 bg-desert/5">
                  <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Still Have Questions? */}
      <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 border border-desert/20">
        <div className="text-center">
          <div className="w-16 h-16 bg-pine text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-heading font-bold text-text mb-4">Still Have Questions?</h2>
          <p className="text-text-secondary leading-relaxed mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Check out our comprehensive guides or browse our resources.
            You can also contact program offices directly—they're there to help!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/guides"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft"
            >
              Read Our Guides
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Link href="/guides/first-time-applying" className="group bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-heading font-semibold text-text mb-2 group-hover:text-pine transition-colors">
            First-Time Applicant Guide
          </h3>
          <p className="text-sm text-text-secondary">Complete beginner's guide to applying for benefits</p>
        </Link>

        <Link href="/stories" className="group bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-heading font-semibold text-text mb-2 group-hover:text-clay transition-colors">
            Success Stories
          </h3>
          <p className="text-sm text-text-secondary">Learn from others who've successfully accessed benefits</p>
        </Link>

        <Link href="/tribes" className="group bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft hover:shadow-soft-lg transition-all">
          <div className="text-3xl mb-3">🏛️</div>
          <h3 className="font-heading font-semibold text-text mb-2 group-hover:text-gold-dark transition-colors">
            Find Your Tribe
          </h3>
          <p className="text-sm text-text-secondary">Contact information for federally recognized tribes</p>
        </Link>
      </div>
    </div>
  )
}
