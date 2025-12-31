'use client'

import { useState, useEffect } from 'react'

interface BrokenLink {
  id: string
  source: string | null
  type: string
  originalValue: string | null
  approved: boolean
  createdAt: string
}

export default function AdminBrokenLinksPage() {
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('pending')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchBrokenLinks()
  }, [filter])

  const fetchBrokenLinks = async () => {
    try {
      const response = await fetch(`/api/admin/broken-links?filter=${filter}`)
      const data = await response.json()
      setBrokenLinks(data.links || [])
    } catch (error) {
      console.error('Failed to fetch broken links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkResolved = async (id: string) => {
    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/broken-links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      })

      if (response.ok) {
        setBrokenLinks(brokenLinks.map((link) =>
          link.id === id ? { ...link, approved: true } : link
        ))
      } else {
        alert('Failed to update link status')
      }
    } catch (error) {
      console.error('Failed to update link:', error)
      alert('Failed to update link status')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this broken link report?')) return

    setActionLoading(id)
    try {
      const response = await fetch(`/api/admin/broken-links/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBrokenLinks(brokenLinks.filter((link) => link.id !== id))
      } else {
        alert('Failed to delete broken link report')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('Failed to delete broken link report')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCheckLink = async (url: string) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      alert('Could not open link')
    }
  }

  const pendingCount = brokenLinks.filter((l) => !l.approved).length

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-teal" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-earth-brown">Broken Links</h1>
          <p className="mt-2 text-earth-brown/70">
            Review and manage broken links detected by weekly scans
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-earth-rust/10 text-earth-rust rounded-earth font-medium">
            {pendingCount} pending review
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-earth-sand/30">
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filter === 'pending'
              ? 'border-earth-teal text-earth-teal'
              : 'border-transparent text-earth-brown/70 hover:text-earth-brown'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filter === 'resolved'
              ? 'border-earth-teal text-earth-teal'
              : 'border-transparent text-earth-brown/70 hover:text-earth-brown'
          }`}
        >
          Resolved
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-earth-teal text-earth-teal'
              : 'border-transparent text-earth-brown/70 hover:text-earth-brown'
          }`}
        >
          All
        </button>
      </div>

      {/* Broken Links Table */}
      <div className="bg-white rounded-earth-lg shadow-sm border border-earth-sand/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-earth-sand/20 border-b border-earth-sand/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Broken URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Detected
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-earth-brown uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-sand/30">
              {brokenLinks.map((link) => (
                <tr key={link.id} className="hover:bg-earth-sand/10">
                  <td className="px-6 py-4">
                    <p className="font-medium text-earth-brown">
                      {link.source || 'Unknown'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-md">
                      <p className="text-sm text-earth-brown/70 truncate font-mono">
                        {link.originalValue || '—'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-earth ${
                        link.approved
                          ? 'bg-earth-sage/10 text-earth-sage'
                          : 'bg-earth-rust/10 text-earth-rust'
                      }`}
                    >
                      {link.approved ? 'Resolved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-earth-brown/70">
                    {new Date(link.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {link.originalValue && (
                        <button
                          onClick={() => handleCheckLink(link.originalValue!)}
                          className="text-earth-teal hover:text-earth-teal/80"
                          title="Test link in new tab"
                        >
                          Test
                        </button>
                      )}
                      {!link.approved && (
                        <button
                          onClick={() => handleMarkResolved(link.id)}
                          disabled={actionLoading === link.id}
                          className="text-earth-sage hover:text-earth-sage/80 disabled:opacity-50"
                        >
                          {actionLoading === link.id ? '...' : 'Resolve'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(link.id)}
                        disabled={actionLoading === link.id}
                        className="text-earth-rust hover:text-earth-rust/80 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {brokenLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">
              {filter === 'pending' ? '✓' : '🔗'}
            </div>
            <p className="text-earth-brown/60">
              {filter === 'pending'
                ? 'No pending broken links to review'
                : filter === 'resolved'
                ? 'No resolved broken links'
                : 'No broken links detected yet'}
            </p>
            <p className="text-sm text-earth-brown/40 mt-2">
              Links are checked automatically every Monday
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-earth-sand/10 rounded-earth-lg p-6 border border-earth-sand/30">
        <h3 className="font-semibold text-earth-brown mb-2">How this works</h3>
        <ul className="text-sm text-earth-brown/70 space-y-1">
          <li>• Broken links are detected automatically every Monday at 2 AM UTC</li>
          <li>• Resources, scholarships, and tribe websites are all checked</li>
          <li>• Use the &quot;Test&quot; button to verify if a link is still broken</li>
          <li>• Mark as &quot;Resolved&quot; after you&apos;ve updated the resource with a working link</li>
          <li>• Delete reports that are false positives or no longer needed</li>
        </ul>
      </div>

      {/* Total Count */}
      <div className="text-sm text-earth-brown/70">
        Showing {brokenLinks.length} broken link reports
      </div>
    </div>
  )
}
