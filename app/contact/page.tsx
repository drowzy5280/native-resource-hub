'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    privacy: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '', privacy: false })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="min-h-screen bg-cream/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-text mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Have a question, suggestion, or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Cards */}
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: 'Email',
              description: 'Send us a message anytime',
              contact: 'support@tribalresourcehub.com',
              href: 'mailto:support@tribalresourcehub.com',
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Response Time',
              description: 'We typically respond within',
              contact: '1-2 Business Days',
              href: null,
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              ),
              title: 'Community',
              description: 'Join the conversation',
              contact: 'Follow us for updates',
              href: null,
            },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-earth-lg p-6 text-center border border-desert/20 shadow-soft">
              <div className="w-16 h-16 bg-pine/10 text-pine rounded-full flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-heading font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-sm text-text-muted mb-2">{item.description}</p>
              {item.href ? (
                <a href={item.href} className="text-pine hover:text-pine-dark font-medium transition-colors">
                  {item.contact}
                </a>
              ) : (
                <p className="text-text font-medium">{item.contact}</p>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-earth-lg p-8 md:p-12 border border-desert/20 shadow-soft mb-12">
          <h2 className="text-2xl font-heading font-bold text-text mb-6">Send Us a Message</h2>

          {status === 'success' ? (
            <div className="bg-pine/10 border border-pine/30 rounded-earth p-6 text-center">
              <svg className="w-16 h-16 text-pine mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-heading font-bold text-text mb-2">Message Sent!</h3>
              <p className="text-text-secondary mb-4">
                Thank you for reaching out. We'll respond within 1-2 business days.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-pine hover:text-pine-dark font-medium"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="bg-clay/10 border border-clay/30 rounded-earth p-4 text-clay-dark">
                  {errorMessage}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                    Your Name <span className="text-clay">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-earth border-2 border-desert/40 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                    Email Address <span className="text-clay">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-earth border-2 border-desert/40 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text mb-2">
                  Subject <span className="text-clay">*</span>
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-earth border-2 border-desert/40 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20 transition-colors bg-white"
                >
                  <option value="">Select a topic...</option>
                  <option value="general">General Question</option>
                  <option value="resource">Suggest a Resource</option>
                  <option value="correction">Report an Error or Broken Link</option>
                  <option value="scholarship">Scholarship Information</option>
                  <option value="feedback">Website Feedback</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                  Message <span className="text-clay">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-earth border-2 border-desert/40 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/20 transition-colors resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  required
                  checked={formData.privacy}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-desert/40 text-pine focus:ring-pine/20"
                />
                <label htmlFor="privacy" className="text-sm text-text-secondary">
                  I agree to the{' '}
                  <Link href="/privacy" className="text-pine hover:text-pine-dark underline">
                    Privacy Policy
                  </Link>{' '}
                  and consent to having my information stored for the purpose of responding to my inquiry.
                </label>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full md:w-auto px-8 py-4 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* FAQ Link */}
        <div className="bg-gradient-to-br from-desert/10 via-cream to-gold/5 rounded-earth-lg p-8 text-center border border-desert/20">
          <h2 className="text-2xl font-heading font-bold text-text mb-4">Looking for Quick Answers?</h2>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto">
            Check out our Frequently Asked Questions page for answers to common questions about
            tribal benefits, eligibility, and using our platform.
          </p>
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
          >
            View FAQs
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-stone/5 rounded-earth border border-stone/20">
          <p className="text-sm text-text-muted text-center">
            <strong>Note:</strong> Tribal Resource Hub is an independent information platform. For specific questions
            about tribal benefits, enrollment, or programs, please contact the relevant tribal government, federal agency,
            or organization directly. We can help point you in the right direction but cannot process applications or
            provide official guidance on your eligibility.
          </p>
        </div>
      </div>
    </div>
  )
}
