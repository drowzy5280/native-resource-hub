'use client'

import { useState } from 'react'
import Link from 'next/link'

type Message = {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
}

type Question = {
  id: string
  question: string
  options: { value: string; label: string }[]
  multiSelect?: boolean
}

type EligibilityResult = {
  programType: string
  eligible: boolean
  confidence: 'high' | 'medium' | 'low'
  reason: string
  nextSteps: string[]
  resources: { title: string; url: string }[]
}

export function EligibilityCheckerChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m here to help you understand what programs and benefits you may be eligible for. I\'ll ask you a few quick questions to provide personalized guidance. Ready to get started?',
      timestamp: new Date(),
    },
  ])

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState<EligibilityResult[]>([])

  const questions: Question[] = [
    {
      id: 'tribalEnrollment',
      question: 'Are you enrolled in a federally recognized tribe?',
      options: [
        { value: 'yes', label: 'Yes, I\'m enrolled' },
        { value: 'no', label: 'No, but I have Native ancestry' },
        { value: 'unknown', label: 'I\'m not sure' },
      ],
    },
    {
      id: 'educationStatus',
      question: 'What is your current education status?',
      options: [
        { value: 'high-school', label: 'High School Student' },
        { value: 'undergraduate', label: 'Undergraduate Student' },
        { value: 'graduate', label: 'Graduate Student' },
        { value: 'not-student', label: 'Not currently a student' },
      ],
    },
    {
      id: 'location',
      question: 'Where do you live?',
      options: [
        { value: 'reservation', label: 'On or near a reservation' },
        { value: 'urban', label: 'Urban area' },
        { value: 'rural', label: 'Rural area (not on reservation)' },
      ],
    },
    {
      id: 'interests',
      question: 'What types of resources are you most interested in? (Select all that apply)',
      multiSelect: true,
      options: [
        { value: 'education', label: 'Education & Scholarships' },
        { value: 'healthcare', label: 'Healthcare Services' },
        { value: 'housing', label: 'Housing Assistance' },
        { value: 'employment', label: 'Employment & Career' },
        { value: 'legal', label: 'Legal Aid' },
        { value: 'cultural', label: 'Cultural Programs' },
      ],
    },
  ]

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    const newAnswers = { ...userAnswers, [questionId]: answer }
    setUserAnswers(newAnswers)

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: Array.isArray(answer)
        ? questions[currentQuestion].options.filter(o => answer.includes(o.value)).map(o => o.label).join(', ')
        : questions[currentQuestion].options.find(o => o.value === answer)?.label || answer,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    // Check if more questions
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        const nextQ = questions[currentQuestion + 1]
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: nextQ.question,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botMessage])
        setCurrentQuestion(prev => prev + 1)
      }, 500)
    } else {
      // Generate results with AI
      setTimeout(async () => {
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          type: 'bot',
          content: 'Analyzing your eligibility...',
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botMessage])

        try {
          const eligibilityResults = await generateResultsWithAI(newAnswers)
          setResults(eligibilityResults)
          setIsComplete(true)

          const resultsMessage: Message = {
            id: `bot-results-${Date.now()}`,
            type: 'bot',
            content: 'Perfect! Based on your answers, I\'ve identified the programs you may be eligible for. Here are your personalized results:',
            timestamp: new Date(),
          }
          setMessages(prev => [...prev.slice(0, -1), resultsMessage])
        } catch (error) {
          console.error('Failed to generate results:', error)
          // Fallback to basic results
          const eligibilityResults = generateResults(newAnswers)
          setResults(eligibilityResults)
          setIsComplete(true)

          const resultsMessage: Message = {
            id: `bot-results-${Date.now()}`,
            type: 'bot',
            content: 'Perfect! Based on your answers, I\'ve identified the programs you may be eligible for. Here are your personalized results:',
            timestamp: new Date(),
          }
          setMessages(prev => [...prev.slice(0, -1), resultsMessage])
        }
      }, 500)
    }
  }

  const generateResultsWithAI = async (answers: Record<string, any>): Promise<EligibilityResult[]> => {
    const response = await fetch('/api/eligibility/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tribalEnrollment: answers.tribalEnrollment,
        educationStatus: answers.educationStatus,
        location: answers.location,
        interests: answers.interests || [],
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to check eligibility')
    }

    const data = await response.json()
    return data.results
  }

  const generateResults = (answers: Record<string, any>): EligibilityResult[] => {
    // Fallback logic if AI API fails

    const results: EligibilityResult[] = []

    // Education Programs
    if (answers.interests?.includes('education')) {
      if (answers.tribalEnrollment === 'yes') {
        results.push({
          programType: 'Federal Scholarships',
          eligible: true,
          confidence: 'high',
          reason: 'As an enrolled tribal member, you qualify for most federal Native American scholarship programs.',
          nextSteps: [
            'Gather your tribal enrollment certificate',
            'Check scholarship deadlines',
            'Prepare your academic transcripts',
            'Write personal essays',
          ],
          resources: [
            { title: 'Browse Scholarships', url: '/scholarships' },
            { title: 'Tribal Enrollment Guide', url: '/guides/tribal-enrollment' },
          ],
        })
      } else {
        results.push({
          programType: 'Descendancy-Based Scholarships',
          eligible: true,
          confidence: 'medium',
          reason: 'Some scholarships accept proof of Native American descendancy without tribal enrollment.',
          nextSteps: [
            'Gather birth certificates linking you to enrolled ancestors',
            'Research scholarships that accept descendancy',
            'Contact your tribe\'s enrollment office',
          ],
          resources: [
            { title: 'Eligibility Requirements Guide', url: '/guides/eligibility-requirements' },
            { title: 'Browse Scholarships', url: '/scholarships?tags=descendancy' },
          ],
        })
      }
    }

    // Healthcare Services
    if (answers.interests?.includes('healthcare')) {
      if (answers.tribalEnrollment === 'yes') {
        results.push({
          programType: 'Indian Health Service (IHS)',
          eligible: true,
          confidence: 'high',
          reason: 'Enrolled tribal members qualify for IHS healthcare services.',
          nextSteps: [
            answers.location === 'reservation'
              ? 'Visit your nearest IHS facility'
              : 'Find an Urban Indian Health Center in your area',
            'Bring tribal enrollment documentation',
            'Register for services',
          ],
          resources: [
            { title: 'Healthcare Resources', url: '/resources?type=healthcare' },
            { title: 'First-Time Applying Guide', url: '/guides/first-time-applying' },
          ],
        })
      }
    }

    // Housing Assistance
    if (answers.interests?.includes('housing')) {
      if (answers.tribalEnrollment === 'yes') {
        results.push({
          programType: 'HUD Native American Housing',
          eligible: true,
          confidence: 'high',
          reason: 'NAHASDA programs provide housing assistance to enrolled tribal members.',
          nextSteps: [
            'Contact your tribe\'s housing authority',
            'Gather income documentation',
            'Complete housing needs assessment',
          ],
          resources: [
            { title: 'Housing Resources', url: '/resources?type=housing' },
          ],
        })
      }
    }

    // Employment & Career
    if (answers.interests?.includes('employment')) {
      results.push({
        programType: 'Native American Employment Programs',
        eligible: true,
        confidence: answers.tribalEnrollment === 'yes' ? 'high' : 'medium',
        reason: answers.tribalEnrollment === 'yes'
          ? 'Enrolled members have access to tribal and federal employment programs.'
          : 'Some employment programs accept Native ancestry proof.',
        nextSteps: [
          'Visit your local Workforce Innovation and Opportunity Act (WIOA) office',
          'Explore tribal employment departments',
          'Look for Native-focused job fairs',
        ],
        resources: [
          { title: 'Employment Resources', url: '/resources?type=employment' },
        ],
      })
    }

    return results
  }

  const handleReset = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Hi! I\'m here to help you understand what programs and benefits you may be eligible for. I\'ll ask you a few quick questions to provide personalized guidance. Ready to get started?',
        timestamp: new Date(),
      },
    ])
    setCurrentQuestion(0)
    setUserAnswers({})
    setIsComplete(false)
    setResults([])
  }

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-success/10 text-success border-success/30'
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/30'
      case 'low':
        return 'bg-error/10 text-error border-error/30'
      default:
        return 'bg-desert/20 text-text border-desert/40'
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Chat Container */}
      <div className="bg-white rounded-earth-lg border border-desert/20 shadow-soft overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pine to-pine-dark p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-heading font-bold">Eligibility Checker</h3>
              <p className="text-xs text-white/80">AI-powered guidance assistant</p>
            </div>
            {isComplete && (
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-earth text-sm font-medium transition-colors"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'bot' ? 'bg-pine/10' : 'bg-clay/10'
              }`}>
                {message.type === 'bot' ? (
                  <svg className="w-5 h-5 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <div
                className={`flex-1 rounded-earth-lg p-4 ${
                  message.type === 'bot'
                    ? 'bg-pine/5 border border-pine/20'
                    : 'bg-clay/5 border border-clay/20'
                }`}
              >
                <p className="text-text leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Question Options */}
          {!isComplete && currentQuestion < questions.length && (
            <div className="space-y-2 pl-11">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    if (questions[currentQuestion].multiSelect) {
                      const current = userAnswers[questions[currentQuestion].id] || []
                      const newValue = current.includes(option.value)
                        ? current.filter((v: string) => v !== option.value)
                        : [...current, option.value]

                      // For multi-select, update temporary state
                      setUserAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: newValue }))
                    } else {
                      handleAnswer(questions[currentQuestion].id, option.value)
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-earth border-2 transition-all ${
                    questions[currentQuestion].multiSelect &&
                    (userAnswers[questions[currentQuestion].id] || []).includes(option.value)
                      ? 'bg-pine text-white border-pine'
                      : 'bg-white text-text border-desert/40 hover:border-pine/40'
                  }`}
                >
                  {option.label}
                </button>
              ))}

              {questions[currentQuestion].multiSelect && (
                <button
                  onClick={() => {
                    const answers = userAnswers[questions[currentQuestion].id] || []
                    if (answers.length > 0) {
                      handleAnswer(questions[currentQuestion].id, answers)
                    }
                  }}
                  disabled={(userAnswers[questions[currentQuestion].id] || []).length === 0}
                  className="w-full px-4 py-3 bg-pine text-white rounded-earth font-semibold hover:bg-pine-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {/* Results */}
          {isComplete && results.length > 0 && (
            <div className="space-y-4 mt-6">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-heading font-bold text-text">
                      {result.programType}
                    </h4>
                    <div className="flex items-center gap-2">
                      {result.eligible && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs font-bold rounded-earth border border-success/30">
                          ✓ Eligible
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs font-medium rounded-earth border ${getConfidenceBadge(result.confidence)}`}>
                        {result.confidence} confidence
                      </span>
                    </div>
                  </div>

                  <p className="text-text-secondary mb-4 leading-relaxed">{result.reason}</p>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-text mb-2">Next Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-text-secondary">
                      {result.nextSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {result.resources.map((resource, i) => (
                      <Link
                        key={i}
                        href={resource.url}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-pine/10 text-pine hover:bg-pine/20 rounded-earth text-sm font-medium transition-colors"
                      >
                        {resource.title}
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-desert/10 px-6 py-3 border-t border-desert/40">
          <p className="text-xs text-text-muted">
            This eligibility assessment is for guidance only and does not guarantee acceptance into any program.
            Please verify requirements with program administrators.
          </p>
        </div>
      </div>
    </div>
  )
}
