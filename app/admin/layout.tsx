import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if user is authenticated and is an admin
  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user has admin role
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  if (!userData || userData.role !== 'admin') {
    redirect('/')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'home' },
    { href: '/admin/resources', label: 'Resources', icon: 'resources' },
    { href: '/admin/scholarships', label: 'Scholarships', icon: 'scholarships' },
    { href: '/admin/tribes', label: 'Tribes', icon: 'tribes' },
    { href: '/admin/import-export', label: 'Import/Export', icon: 'upload' },
  ]

  return (
    <div className="min-h-screen bg-earth-cream">
      {/* Admin Header */}
      <div className="bg-earth-brown text-earth-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-earth-teal rounded-earth" />
                <span className="text-lg font-bold">Admin Dashboard</span>
              </Link>
            </div>
            <Link
              href="/"
              className="text-sm text-earth-cream/80 hover:text-earth-cream transition-colors"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white border-b border-earth-sand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-4 px-1 border-b-2 border-transparent hover:border-earth-teal text-earth-brown hover:text-earth-teal transition-colors whitespace-nowrap font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
