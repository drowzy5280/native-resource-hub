import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Get counts for all entities
  const [resourceCount, scholarshipCount, tribeCount, userCount] = await Promise.all([
    prisma.resource.count({ where: { deletedAt: null } }),
    prisma.scholarship.count({ where: { deletedAt: null } }),
    prisma.tribe.count({ where: { deletedAt: null } }),
    prisma.user.count(),
  ])

  // Get recent resources
  const recentResources = await prisma.resource.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
      tribe: {
        select: { name: true },
      },
    },
  })

  // Get recent scholarships
  const recentScholarships = await prisma.scholarship.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  const stats = [
    {
      label: 'Total Resources',
      value: resourceCount,
      href: '/admin/resources',
      color: 'bg-earth-teal',
    },
    {
      label: 'Total Scholarships',
      value: scholarshipCount,
      href: '/admin/scholarships',
      color: 'bg-earth-sage',
    },
    {
      label: 'Total Tribes',
      value: tribeCount,
      href: '/admin/tribes',
      color: 'bg-earth-rust',
    },
    {
      label: 'Total Users',
      value: userCount,
      href: '#',
      color: 'bg-earth-brown',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-earth-brown">Dashboard</h1>
        <p className="mt-2 text-earth-brown/70">
          Manage resources, scholarships, and tribes for the Native Resource Hub
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-brown/70 font-medium">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-earth-brown">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-earth opacity-10`} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Resources */}
        <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-earth-brown">Recent Resources</h2>
            <Link
              href="/admin/resources"
              className="text-sm text-earth-teal hover:text-earth-teal/80 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recentResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-start gap-3 pb-4 border-b border-earth-sand/30 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-earth-brown truncate">
                    {resource.title}
                  </p>
                  <p className="text-sm text-earth-brown/60 mt-1">
                    {resource.type} • {resource.tribe?.name || 'General'}
                  </p>
                </div>
                <span className="text-xs text-earth-brown/60 whitespace-nowrap">
                  {new Date(resource.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {recentResources.length === 0 && (
              <p className="text-center text-earth-brown/60 py-8">
                No resources yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Scholarships */}
        <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-earth-brown">
              Recent Scholarships
            </h2>
            <Link
              href="/admin/scholarships"
              className="text-sm text-earth-teal hover:text-earth-teal/80 font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recentScholarships.map((scholarship) => (
              <div
                key={scholarship.id}
                className="flex items-start gap-3 pb-4 border-b border-earth-sand/30 last:border-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-earth-brown truncate">
                    {scholarship.name}
                  </p>
                  <p className="text-sm text-earth-brown/60 mt-1">
                    {scholarship.amount || 'Amount varies'}
                    {scholarship.deadline &&
                      ` • Due ${new Date(scholarship.deadline).toLocaleDateString()}`}
                  </p>
                </div>
                <span className="text-xs text-earth-brown/60 whitespace-nowrap">
                  {new Date(scholarship.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
            {recentScholarships.length === 0 && (
              <p className="text-center text-earth-brown/60 py-8">
                No scholarships yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 p-6">
        <h2 className="text-xl font-bold text-earth-brown mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/resources"
            className="p-4 border-2 border-earth-sand rounded-earth hover:border-earth-teal hover:bg-earth-teal/5 transition-colors"
          >
            <h3 className="font-semibold text-earth-brown mb-1">
              Add Resource
            </h3>
            <p className="text-sm text-earth-brown/60">
              Add a new resource to the platform
            </p>
          </Link>
          <Link
            href="/admin/scholarships"
            className="p-4 border-2 border-earth-sand rounded-earth hover:border-earth-teal hover:bg-earth-teal/5 transition-colors"
          >
            <h3 className="font-semibold text-earth-brown mb-1">
              Add Scholarship
            </h3>
            <p className="text-sm text-earth-brown/60">
              Add a new scholarship opportunity
            </p>
          </Link>
          <Link
            href="/admin/tribes"
            className="p-4 border-2 border-earth-sand rounded-earth hover:border-earth-teal hover:bg-earth-teal/5 transition-colors"
          >
            <h3 className="font-semibold text-earth-brown mb-1">Add Tribe</h3>
            <p className="text-sm text-earth-brown/60">
              Add a new tribe to the directory
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
