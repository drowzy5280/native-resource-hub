import { Metadata } from 'next'
import { SectionHeader } from '@/components/SectionHeader'
import { ResourceCard } from '@/components/ResourceCard'
import { EmptyState } from '@/components/EmptyState'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Saved Resources',
  description: 'View and manage your saved resources, scholarships, and programs.',
}

export default async function SavedPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = !!user

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionHeader
          title="Saved Resources"
          description="Sign in to save and manage your favorite resources"
        />

        <div className="mt-12">
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-pine/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-heading font-bold text-text mb-4">Sign In Required</h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
              Create an account or sign in to save resources, track scholarships, and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signin"
                className="px-8 py-3 bg-pine text-white rounded-earth-lg font-semibold hover:bg-pine-dark transition-colors shadow-soft"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-8 py-3 bg-white text-pine border-2 border-pine rounded-earth-lg font-semibold hover:bg-pine/5 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Benefits of Signing In */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
            <div className="w-12 h-12 bg-pine/10 rounded-earth flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pine" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-heading font-bold text-text mb-2">Save Resources</h3>
            <p className="text-text-secondary">
              Bookmark resources and scholarships to access them quickly anytime, anywhere.
            </p>
          </div>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
            <div className="w-12 h-12 bg-clay/10 rounded-earth flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-heading font-bold text-text mb-2">Track Applications</h3>
            <p className="text-text-secondary">
              Monitor your scholarship applications with status tracking and deadline reminders.
            </p>
          </div>

          <div className="bg-white rounded-earth-lg p-6 border border-desert/20 shadow-soft">
            <div className="w-12 h-12 bg-gold/10 rounded-earth flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-heading font-bold text-text mb-2">Get Recommendations</h3>
            <p className="text-text-secondary">
              Receive personalized resource recommendations based on your profile and interests.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Fetch user's saved resources
  const savedResourcesData = await prisma.savedResource.findMany({
    where: {
      userId: user.id,
      resource: {
        deletedAt: null,
      },
    },
    include: {
      resource: {
        include: {
          tribe: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const savedResources = savedResourcesData.map((sr) => sr.resource)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        title="Saved Resources"
        description={`${savedResources.length} saved items`}
      />

      {savedResources.length === 0 ? (
        <div className="mt-12">
          <EmptyState
            icon="🔖"
            title="No Saved Resources Yet"
            description="Start exploring and save resources that interest you. They'll appear here for easy access."
            actionLabel="Browse Resources"
            actionHref="/resources"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {savedResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              id={resource.id}
              title={resource.title}
              description={resource.description}
              type={resource.type}
              tags={resource.tags}
              tribe={resource.tribe || undefined}
              state={resource.state}
              url={resource.url}
            />
          ))}
        </div>
      )}
    </div>
  )
}
