import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ResourceCard } from '@/components/ResourceCard'
import { EmptyState } from '@/components/EmptyState'
import { getUser } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Saved Resources - Native Resource Hub',
  description: 'View your saved resources and scholarships',
}

export const dynamic = 'force-dynamic'

export default async function SavedPage() {
  const user = await getUser()

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon="🔒"
          title="Sign In Required"
          description="Please sign in to view your saved resources"
          actionLabel="Go Home"
          actionHref="/"
        />
      </div>
    )
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          icon="❌"
          title="User Not Found"
          description="Your user account could not be found"
          actionLabel="Go Home"
          actionHref="/"
        />
      </div>
    )
  }

  const savedResources = await prisma.savedResource.findMany({
    where: {
      userId: user.id,
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

  const resources = savedResources.map((sr) => sr.resource)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-earth-brown mb-8">Saved Resources</h1>

      {resources.length === 0 ? (
        <EmptyState
          icon="📌"
          title="No Saved Resources"
          description="You haven't saved any resources yet. Start exploring and save resources for later!"
          actionLabel="Browse Resources"
          actionHref="/resources"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
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
              userId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
