import { Metadata } from 'next'
import { SectionHeader } from '@/components/SectionHeader'
import { EligibilityCheckerChatbot } from '@/components/EligibilityCheckerChatbot'

export const metadata: Metadata = {
  title: 'Eligibility Checker | Tribal Resource Hub',
  description: 'Find out what Native American programs, scholarships, and benefits you qualify for with our AI-powered eligibility checker.',
}

export default function EligibilityCheckerPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <SectionHeader
        title="Eligibility Checker"
        description="Get personalized guidance on programs you may qualify for"
      />

      {/* Info Section */}
      <div className="bg-gradient-to-br from-pine/10 via-cream to-gold/10 rounded-earth-lg p-8 mb-12 border border-desert/20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-pine/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-heading font-bold text-text mb-4">
            Not Sure What You Qualify For?
          </h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            Our AI-powered eligibility checker asks a few simple questions to determine which scholarships,
            resources, and benefits you may be eligible for. Get personalized results in under 2 minutes.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Fast & Easy</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="mb-16">
        <EligibilityCheckerChatbot />
      </div>

      {/* Additional Resources */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-heading font-bold text-text mb-2">
            Eligibility Requirements Guide
          </h3>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            Learn about different types of eligibility requirements and what documents you'll need.
          </p>
          <a
            href="/guides/eligibility-requirements"
            className="text-pine hover:text-pine-dark font-medium text-sm inline-flex items-center gap-1 transition-colors"
          >
            Read Guide
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-heading font-bold text-text mb-2">
            Tribal Enrollment Guide
          </h3>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            Step-by-step instructions for obtaining tribal enrollment documentation and CDIB certificates.
          </p>
          <a
            href="/guides/tribal-enrollment"
            className="text-pine hover:text-pine-dark font-medium text-sm inline-flex items-center gap-1 transition-colors"
          >
            Read Guide
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
          <div className="text-4xl mb-4">❓</div>
          <h3 className="text-lg font-heading font-bold text-text mb-2">
            Frequently Asked Questions
          </h3>
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">
            Get answers to common questions about eligibility, applications, and available benefits.
          </p>
          <a
            href="/faq"
            className="text-pine hover:text-pine-dark font-medium text-sm inline-flex items-center gap-1 transition-colors"
          >
            View FAQs
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Technical Implementation Note */}
      <div className="bg-white rounded-earth-lg p-8 border border-desert/20 shadow-soft">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-pine flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-heading font-bold text-text mb-2">
              About This Feature
            </h3>
            <div className="text-sm text-text-secondary space-y-2 leading-relaxed">
              <p>
                <strong className="text-text">Current Implementation:</strong> This eligibility checker uses a
                rule-based decision tree to provide guidance based on user responses. The interface demonstrates
                a conversational chatbot experience with sample eligibility logic.
              </p>
              <p>
                <strong className="text-text">Production Enhancement:</strong> To create a truly AI-powered
                eligibility checker, you would integrate:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Natural language processing for free-form questions</li>
                <li>LLM integration (Claude, GPT-4) for intelligent responses</li>
                <li>Dynamic question generation based on previous answers</li>
                <li>Real-time program requirement checking against database</li>
                <li>Confidence scoring using ML models</li>
                <li>Conversation history and follow-up question support</li>
              </ul>
              <p className="mt-3">
                <strong className="text-text">See:</strong>{' '}
                <code className="px-2 py-1 bg-desert/10 rounded text-xs">
                  components/EligibilityCheckerChatbot.tsx:91-95
                </code>{' '}
                for the decision logic
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
